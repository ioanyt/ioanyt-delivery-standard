# CloudWatch Alarms
#
# Production alerting configuration for:
# - High error rates
# - Latency spikes
# - Unhealthy hosts
# - Resource utilization
#
# Add this file to your environment's Terraform configuration.

# -----------------------------------------------------
# SNS Topic for Alerts
# -----------------------------------------------------
resource "aws_sns_topic" "alerts" {
  name = "${local.service_name}-${local.environment}-alerts"
  tags = local.tags
}

# Email subscription (add your email)
# resource "aws_sns_topic_subscription" "email" {
#   topic_arn = aws_sns_topic.alerts.arn
#   protocol  = "email"
#   endpoint  = "alerts@ioanyt.com"
# }

# Slack subscription (via Lambda or AWS Chatbot)
# Configure AWS Chatbot for Slack integration

# -----------------------------------------------------
# High Error Rate Alarm
# -----------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "high_error_rate" {
  alarm_name          = "${local.service_name}-${local.environment}-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  threshold           = 5  # 5% error rate

  metric_query {
    id          = "error_rate"
    expression  = "(errors/requests)*100"
    label       = "Error Rate"
    return_data = true
  }

  metric_query {
    id = "errors"
    metric {
      metric_name = "HTTPCode_Target_5XX_Count"
      namespace   = "AWS/ApplicationELB"
      period      = 60
      stat        = "Sum"
      dimensions = {
        LoadBalancer = aws_lb.main.arn_suffix
      }
    }
  }

  metric_query {
    id = "requests"
    metric {
      metric_name = "RequestCount"
      namespace   = "AWS/ApplicationELB"
      period      = 60
      stat        = "Sum"
      dimensions = {
        LoadBalancer = aws_lb.main.arn_suffix
      }
    }
  }

  alarm_description = "Error rate exceeded 5% for 2 consecutive minutes"
  alarm_actions     = [aws_sns_topic.alerts.arn]
  ok_actions        = [aws_sns_topic.alerts.arn]

  tags = local.tags
}

# -----------------------------------------------------
# High Latency Alarm (p95)
# -----------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "high_latency" {
  alarm_name          = "${local.service_name}-${local.environment}-high-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "p95"
  threshold           = 1.0  # 1 second p95

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  alarm_description = "p95 latency exceeded 1 second for 3 consecutive minutes"
  alarm_actions     = [aws_sns_topic.alerts.arn]
  ok_actions        = [aws_sns_topic.alerts.arn]

  tags = local.tags
}

# -----------------------------------------------------
# Unhealthy Hosts Alarm
# -----------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "unhealthy_hosts" {
  alarm_name          = "${local.service_name}-${local.environment}-unhealthy-hosts"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Maximum"
  threshold           = 0

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
    TargetGroup  = aws_lb_target_group.main.arn_suffix
  }

  alarm_description = "One or more hosts are unhealthy"
  alarm_actions     = [aws_sns_topic.alerts.arn]
  ok_actions        = [aws_sns_topic.alerts.arn]

  tags = local.tags
}

# -----------------------------------------------------
# No Healthy Hosts Alarm (Critical)
# -----------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "no_healthy_hosts" {
  alarm_name          = "${local.service_name}-${local.environment}-no-healthy-hosts"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "HealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Minimum"
  threshold           = 1

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
    TargetGroup  = aws_lb_target_group.main.arn_suffix
  }

  alarm_description = "CRITICAL: No healthy hosts available"
  alarm_actions     = [aws_sns_topic.alerts.arn]
  ok_actions        = [aws_sns_topic.alerts.arn]

  tags = local.tags
}

# -----------------------------------------------------
# High CPU Utilization Alarm
# -----------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${local.service_name}-${local.environment}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 85

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = module.ecs_service.service_name
  }

  alarm_description = "CPU utilization exceeded 85% for 3 consecutive minutes"
  alarm_actions     = [aws_sns_topic.alerts.arn]
  ok_actions        = [aws_sns_topic.alerts.arn]

  tags = local.tags
}

# -----------------------------------------------------
# High Memory Utilization Alarm
# -----------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "high_memory" {
  alarm_name          = "${local.service_name}-${local.environment}-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 90

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = module.ecs_service.service_name
  }

  alarm_description = "Memory utilization exceeded 90% for 3 consecutive minutes"
  alarm_actions     = [aws_sns_topic.alerts.arn]
  ok_actions        = [aws_sns_topic.alerts.arn]

  tags = local.tags
}

# -----------------------------------------------------
# Low Request Count (Potential Issue)
# -----------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "low_request_count" {
  alarm_name          = "${local.service_name}-${local.environment}-low-requests"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 5
  metric_name         = "RequestCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 1  # Adjust based on expected traffic

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  alarm_description = "No requests received for 5 minutes - potential connectivity issue"
  alarm_actions     = [aws_sns_topic.alerts.arn]
  ok_actions        = [aws_sns_topic.alerts.arn]

  # Only trigger during business hours (optional)
  # insufficient_data_actions = []
  treat_missing_data = "notBreaching"

  tags = local.tags
}
