# 🚌 Projeto Caravana Docker (Microsserviços em Kubernetes/Kind)

Este repositório contém a infraestrutura e a configuração de deployment para uma aplicação de microsserviços composta por Frontend, Backend e Banco de Dados (MongoDB). Toda a aplicação é orquestrada usando **Kubernetes** e o ambiente de desenvolvimento **Kind (Kubernetes in Docker)**.

## 🚀 Estrutura do Projeto e Configurações de Rede

A aplicação é dividida em três microsserviços, com a seguinte configuração de portas e acessos:

| Serviço | Imagem Docker | Porta do Service (Interna K8s) | HostPort (Acesso Local via Kind) | NodePort (K8s) |
| :---: | :---: | :---: | :---: | :---: |
| **Frontend** | `jhonatanmjesus/caravanadocker-frontend:latest` | 80 | 5173 | 30001 |
| **Backend** | `jhonatanmjesus/caravanadocker-backend:latest` | 3000 | 3000 | 30000 |
| **MongoDB** | `mongo:6` | 27018 | 27018 | 30002 |

## ⚙️ Pré-requisitos

Você precisará ter as seguintes ferramentas instaladas no seu sistema:

1.  **Docker:** Para rodar o Kind.
2.  **Kubernetes CLI (`kubectl`):** Para interagir com o cluster.
3.  **Kind:** Para criar o cluster Kubernetes local.

## 💻 Configuração e Execução

Siga os passos abaixo para configurar e iniciar a aplicação no seu ambiente local.

### 1. Criar o Cluster Kind

O arquivo `kind-config.yml` configura o mapeamento de portas NodePort para portas acessíveis no seu `localhost`.

```bash
# Cria o cluster com as configurações de mapeamento de portas
kind create cluster --config kind-config.yml
```

### 2. Aplicar os Manifestos do KubernetesAplique todos os arquivos de deployment na ordem recomendada (primeiro o banco, depois os serviços):
```Bash
# 1. Aplica o Deployment e Service do MongoDB
kubectl apply -f mongo-deployment.yml

# 2. Aplica o Deployment e Service do Backend
kubectl apply -f backend-deployment.yml

# 3. Aplica o Deployment e Service do Frontend
kubectl apply -f frontend-deployment.yml
```
### 3. Verificar o Status dos PodsAguarde até que todos os Pods estejam no estado Running e READY.
```Bash
kubectl get pods
kubectl get svc
```

### 🌐 Acesso à Aplicação
Use as portas mapeadas no seu kind-config.yml para acessar a aplicação:

| Serviço | Endereço de Acesso |
| :---: | :---: |
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |

## 🛠️ Configuração de Conexão (Interna K8s)
A comunicação interna entre os microsserviços é configurada da seguinte forma:<br />
**Frontend** acessa **Backend**: VITE_API_URL usa http://backend:3000.<br />
**Backend** acessa **MongoDB**: DATABASE_URL usa a porta correta do Service:<br />
mongodb://@mongo-svc:27018/Caravana

## 💡 Debugging e Acesso ao DBAcesso Externo ao MongoDB (Compass)

Para acessar o banco de dados via MongoDB Compass, utilize a HostPort e as credenciais:URI de Conexão: mongodb://localhost:27018/Caravana
## 🗑️ Limpeza (Destruindo o Cluster)
Quando terminar de usar o ambiente, destrua o cluster Kind para liberar recursos:
```Bash
kind delete cluster --name caravana
```