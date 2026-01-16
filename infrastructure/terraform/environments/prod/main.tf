# Production Environment
#
# Production-grade configuration with:
# - Multi-AZ deployment
# - Higher availability settings
# - Deletion protection enabled
# - Enhanced monitoring
#
# NOTE: This is a reference implementation.
# Actual production would need:
# - ACM certificate for HTTPS
# - Route53 DNS configuration
# - WAF for API protection
# - Additional security hardening

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "ioanyt-terraform-state"
    key            = "delivery-standard/prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "delivery-standard"
      Environment = "prod"
      ManagedBy   = "terraform"
    }
  }
}

locals {
  service_name = "delivery-standard"
  environment  = "prod"

  tags = {
    Service     = local.service_name
    Environment = local.environment
  }
}

# -----------------------------------------------------
# Data Sources
# -----------------------------------------------------
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# -----------------------------------------------------
# VPC - Production (Multi-AZ, redundant NAT)
# -----------------------------------------------------
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${local.service_name}-${local.environment}"
  cidr = "10.1.0.0/16"

  azs             = slice(data.aws_availability_zones.available.names, 0, 3)
  private_subnets = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
  public_subnets  = ["10.1.101.0/24", "10.1.102.0/24", "10.1.103.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway     = false  # Production: NAT per AZ
  one_nat_gateway_per_az = true
  enable_dns_hostnames   = true
  enable_dns_support     = true

  tags = local.tags
}

# -----------------------------------------------------
# Security Groups
# -----------------------------------------------------
resource "aws_security_group" "alb" {
  name        = "${local.service_name}-${local.environment}-alb"
  description = "Security group for ALB"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP (redirect)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.tags
}

resource "aws_security_group" "ecs_tasks" {
  name        = "${local.service_name}-${local.environment}-tasks"
  description = "Security group for ECS tasks"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "Traffic from ALB"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.tags
}

# -----------------------------------------------------
# Application Load Balancer
# -----------------------------------------------------
resource "aws_lb" "main" {
  name               = "${local.service_name}-${local.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets

  enable_deletion_protection = true  # Production: enabled

  access_logs {
    bucket  = aws_s3_bucket.alb_logs.id
    prefix  = "alb"
    enabled = true
  }

  tags = local.tags
}

resource "aws_s3_bucket" "alb_logs" {
  bucket = "${local.service_name}-${local.environment}-alb-logs-${data.aws_caller_identity.current.account_id}"

  tags = local.tags
}

resource "aws_s3_bucket_lifecycle_configuration" "alb_logs" {
  bucket = aws_s3_bucket.alb_logs.id

  rule {
    id     = "expire-old-logs"
    status = "Enabled"

    expiration {
      days = 90
    }
  }
}

resource "aws_s3_bucket_policy" "alb_logs" {
  bucket = aws_s3_bucket.alb_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::127311923021:root"  # ELB account for us-east-1
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.alb_logs.arn}/alb/*"
      }
    ]
  })
}

resource "aws_lb_target_group" "main" {
  name        = "${local.service_name}-${local.environment}"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 15
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }

  tags = local.tags
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# HTTPS listener (requires certificate)
# resource "aws_lb_listener" "https" {
#   load_balancer_arn = aws_lb.main.arn
#   port              = 443
#   protocol          = "HTTPS"
#   ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
#   certificate_arn   = var.certificate_arn
#
#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.main.arn
#   }
# }

# -----------------------------------------------------
# ECR Repository (shared with staging)
# -----------------------------------------------------
data "aws_ecr_repository" "main" {
  name = local.service_name
}

# -----------------------------------------------------
# ECS Cluster
# -----------------------------------------------------
resource "aws_ecs_cluster" "main" {
  name = "ioanyt-${local.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = local.tags
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}

# -----------------------------------------------------
# CloudWatch Log Group
# -----------------------------------------------------
resource "aws_cloudwatch_log_group" "main" {
  name              = "/ecs/${local.service_name}-${local.environment}"
  retention_in_days = 90  # Production: longer retention

  tags = local.tags
}

# -----------------------------------------------------
# IAM Roles
# -----------------------------------------------------
resource "aws_iam_role" "ecs_execution" {
  name = "${local.service_name}-${local.environment}-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task" {
  name = "${local.service_name}-${local.environment}-task"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = local.tags
}

resource "aws_iam_role_policy" "ecs_task" {
  name = "${local.service_name}-${local.environment}-task-policy"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.main.arn}:*"
      }
    ]
  })
}

# -----------------------------------------------------
# ECS Service - Production Settings
# -----------------------------------------------------
module "ecs_service" {
  source = "../../modules/ecs-service"

  service_name       = local.service_name
  aws_region         = var.aws_region
  ecs_cluster_arn    = aws_ecs_cluster.main.arn
  ecs_cluster_name   = aws_ecs_cluster.main.name
  ecr_repository_url = data.aws_ecr_repository.main.repository_url
  image_tag          = var.image_tag

  container_port     = 3000
  cpu                = 512     # Production: more resources
  memory             = 1024
  desired_count      = 2       # Production: minimum 2 for HA
  min_capacity       = 2
  max_capacity       = 20

  private_subnet_ids = module.vpc.private_subnets
  security_group_id  = aws_security_group.ecs_tasks.id
  target_group_arn   = aws_lb_target_group.main.arn
  execution_role_arn = aws_iam_role.ecs_execution.arn
  task_role_arn      = aws_iam_role.ecs_task.arn
  log_group_name     = aws_cloudwatch_log_group.main.name

  environment_variables = {
    NODE_ENV  = "production"
    LOG_LEVEL = "info"
  }

  tags = local.tags
}
