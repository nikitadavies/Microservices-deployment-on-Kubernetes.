provider "google" {
  project = "cloud-computing-417600"
  region  = "us-central1"
}

resource "google_container_cluster" "standard_cluster" {
  name     = "standard-cluster"
  location = "us-central1-a"
  initial_node_count = 1
  node_config {
      machine_type = "e2-micro"
      disk_size_gb = 10
      disk_type    = "pd-standard"
      image_type   = "COS_CONTAINERD"
  }
}