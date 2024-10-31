import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CircleCheckBig,
  CircleIcon,
  CircleX,
  CircleAlert,
  Clock,
} from "@repo/icons"

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
]

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: CircleAlert,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Clock,
  },
  {
    value: "done",
    label: "Done",
    icon: CircleCheckBig,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CircleX,
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
]
