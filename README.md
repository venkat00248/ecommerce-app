# Morrow commerce platform

An ecommerce monorepo built with React, Redux Toolkit, Node.js, GraphQL, MongoDB, Kafka, Docker, Kubernetes, and GCP Terraform foundations.

## Local development

1. Install Node.js 20+ and Docker Desktop.
2. Run `npm install`.
3. Start dependencies with `docker compose up -d`.
4. Run the API with `npm run dev:api`.
5. Run the storefront with `npm run dev:web`, then open the Vite URL shown in the terminal.

The API is available at `http://localhost:4000/graphql` and `http://localhost:4000/health`. The worker can be started with `npm run dev:worker` after Kafka is running.

## Verification

Run `npm run typecheck` and `npm run build`. Copy each `.env.example` to `.env` only when you need to override local defaults. Never commit credentials.

## Deployment foundations

`infra/kubernetes` contains service, deployment, config, and secret templates. `infra/gcp` contains Terraform variables and a GKE/Artifact Registry starting point. Replace placeholder project values and wire a managed MongoDB provider before production use.

## Harness deployment

The Harness pipeline is defined in `.harness/ecommerce-gke.yaml`. Import it into a Harness project and provide:

- A Git connector for this repository.
- A Kubernetes connector for the Harness CI namespace.
- A GCP service account JSON key as the secret `harness_gcp_service_account_key`.
- MongoDB and Kafka values as `harness_mongo_uri` and `harness_kafka_brokers` secrets.
- GCP Artifact Registry and GKE permissions for the service account.

The pipeline runs lint, typecheck, and builds; submits the API, worker, and web images to Artifact Registry through Google Cloud Build; creates the Kubernetes namespace and runtime secret; applies the manifests; and waits for all three deployments to roll out. Replace the pipeline's `<+input>` values for the Harness organization, project, Git connector, and CI Kubernetes connector during import.