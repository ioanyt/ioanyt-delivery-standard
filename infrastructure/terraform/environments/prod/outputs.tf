# Production Environment Outputs

output "api_endpoint" {
  description = "API endpoint URL"
  value       = "https://${aws_lb.main.dns_name}"
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.main.dns_name
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.ecs_service.service_name
}

output "log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.main.name
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}
