# Tekton Pipelines Demo

## Introduction
- This repoitory contains a simple React application and yaml files that demonstrates both Knative Build and Tekton Pipelines (from testing, building and deploying an application)
- The React application simply display a message, an image and these will change base on an environment variables `REACT_APP_DRINK` (either `lemonade` or `cocktail`), we will use this to make 2 versions of our application.

## Prerequisite

- Setup a Kubernetes cluster (make sure node pool has access scope to Cloud Platform in case of GKE).
- Install [Knative](https://knative.dev/docs/install/).
- Install [Tekton Pipelines](https://github.com/tektoncd/pipeline/blob/master/docs/install.md).
- Find and replace all `https://github.com/khanh-alice/tekton-demo.git` with yours git repository if needed.
- Find and replace all `docker.io/khanhalice` with yours Docker Hub repository.
- Generate base64 of your Docker Hub username and password and update it into `k8s/secret.yaml`
- Setup secret and service account.

```bash
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/service-account.yaml
```

- Configure domain with nip.io by following this [link](https://github.com/meteatamel/knative-tutorial/blob/master/docs/02-configuredomain.md).

## Knative Build

> Note: This component will be deprecated soon in favor of Tekton Pipelines. So feel free to skip this section.

### Build

- Create a Build.

```bash
kubectl apply -f knative/build-v1.yaml
```

- Verify that a Build is created and a corresponding pod is spinning up.

```
kubectl get pod,build

NAME                                                  READY   STATUS     RESTARTS   AGE
pod/build-v1-pod-4948af                               0/1     Init:4/5   0          75s

NAME                               SUCCEEDED   REASON    STARTTIME   COMPLETIONTIME
build.build.knative.dev/build-v1   Unknown     Pending   1m
```

- View logs of this Build (adjust your pod name accordingly).

```bash
kubectl logs --all-containers=true --follow pod/build-v1-pod-4948af
```

- After the build is completed, verify that the image `tekton-demo:1.0` is pushed to your Docker Hub repository.

- You can now deploy the image to Kubernetes.

```bash
kubectl apply -f knative/service-v1.yaml
```

- Verify that the image is deployed successfully.

```bash
kubectl get pod,ksvc

NAME                                                  READY   STATUS      RESTARTS   AGE
pod/build-v1-pod-4948af                               0/1     Completed   0          23m
pod/my-app-v1-deployment-5d87bdc876-bbv7n             2/2     Running     0          9s

NAME                                 URL                                         LATESTCREATED   LATESTREADY   READY   REASON
service.serving.knative.dev/my-app   http://my-app.default.35.188.22.28.nip.io   my-app-v1       my-app-v1     True
```

- You can access the site at http://my-app.default.35.188.22.28.nip.io (adjust your ingress IP accordingly).

### BuildTemplate

- Create a BuildTemplate.

```bash
kubectl apply -f knative/build-template.yaml
```

- Verify that a BuildTemplate is created.

```bash
kubectl get buildtemplate

NAME                   AGE
react-build-template   16s
```

- Create a Build that using the above BuildTemplate.

```bash
kubectl apply -f knative/build-v2.yaml
```

- Verify that a Build is created and a corresponding pod is spinning up.

```bash
kubectl get pod,build

NAME                                                  READY   STATUS      RESTARTS   AGE
pod/build-v1-pod-4948af                               0/1     Completed   0          28m
pod/build-v2-pod-5ff490                               0/1     Init:2/5    0          15s

NAME                               SUCCEEDED   REASON    STARTTIME   COMPLETIONTIME
build.build.knative.dev/build-v1   True                  28m
build.build.knative.dev/build-v2   Unknown     Pending   16s
```

- After this build is completed, verify that the image `tekton-demo:1.0-build-template` is pushed to your Docker Hub repository.

## Tekton Pipelines

### PipelineResource

- Create 2 PipelineResources (git & image).

```bash
kubectl apply -f tekton/pipeline-resource-git.yaml
kubectl apply -f tekton/pipeline-resource-image.yaml
```

- Verify that those PipelineResources have been created.

```bash
kubectl get pipelineresource

NAME                AGE
tekton-demo-git     20h
tekton-demo-image   20h
```

### Task & TaskRun

- Create 3 Tasks (test, build & deploy).

```bash
kubectl apply -f tekton/task-test.yaml
kubectl apply -f tekton/task-build.yaml
kubectl apply -f tekton/task-deploy.yaml
```

- Verify that those Tasks have been created.

```bash
kubectl get task

NAME          AGE
build-task    20h
deploy-task   20h
test-task     20h
```

- Run a task with a TaskRun.

```bash
kubectl apply -f tekton/task-run-test.yaml
```

- Verify that a TaskRun is created and a corresponding pod is spinning up.

```bash
kubectl get pod,taskrun

NAME                                                  READY   STATUS      RESTARTS   AGE
pod/build-v1-pod-4948af                               0/1     Completed   0          49m
pod/build-v2-pod-5ff490                               0/1     Completed   0          20m
pod/task-run-test-pod-0adeaa                          3/3     Running     0          10s

NAME                                                     SUCCEEDED   REASON      STARTTIME   COMPLETIONTIME
taskrun.tekton.dev/task-run-test                         Unknown     Building    12s
```

- View logs of this TaskRun (adjust your pod name accordingly).

```bash
kubectl logs --all-containers=true --follow pod/task-run-test-pod-0adeaa
```

- You can run task for `build-task` & `deploy-task` with their corresponding TaskRun yaml file `task-run-build.yaml` & `task-run-deploy.yaml`.

### Pipeline & PipelineRun

- Create a Pipeline.

```bash
kubectl apply -f tekton/pipeline.yaml
```

- Verify that a Pipeline is created.

```bash
kubectl get pipeline

NAME            AGE
demo-pipeline   1m
```

- Run this Pipeline with a PipelineRun.

```bash
kubectl apply -f tekton/pipeline-run-v1.yaml
```

- Verify that a PipelineRun, 3 TaskRun and 3 arcordingly Pods are created.

```bash
NAME                                                  READY   STATUS              RESTARTS   AGE
pod/build-v1-pod-4948af                               0/1     Completed           0          67m
pod/build-v2-pod-5ff490                               0/1     Completed           0          39m
pod/my-app-v2-deployment-59d4f99745-9mcjz             0/2     ContainerCreating   0          0s
pod/pipeline-run-v1-build-my-app-q2kf5-pod-6518f7     0/3     Completed           0          3m1s
pod/pipeline-run-v1-deploy-my-app-h5qmr-pod-acd39d    0/2     Completed           0          55s
pod/pipeline-run-v1-test-my-app-pgxvc-pod-5062a6      0/3     Completed           0          3m56s
pod/task-run-test-pod-0adeaa                          0/3     Completed           0          18m

NAME                                     SUCCEEDED   REASON      STARTTIME   COMPLETIONTIME
pipelinerun.tekton.dev/pipeline-run-v1   True        Succeeded   3m          1s

NAME                                                     SUCCEEDED   REASON      STARTTIME   COMPLETIONTIME
taskrun.tekton.dev/demo-task-run                         True        Succeeded   20h         20h
taskrun.tekton.dev/pipeline-run-v1-build-my-app-q2kf5    True        Succeeded   3m          57s
taskrun.tekton.dev/pipeline-run-v1-deploy-my-app-h5qmr   True        Succeeded   57s         1s
taskrun.tekton.dev/pipeline-run-v1-test-my-app-pgxvc     True        Succeeded   3m          3m
taskrun.tekton.dev/task-run-test                         True        Succeeded   18m         18m
```

- After the pipeline is finished, `my-app` service is also updated with the new image.

```bash
kubectl get pod,ksvc

NAME                                                  READY   STATUS      RESTARTS   AGE
pod/build-v1-pod-4948af                               0/1     Completed   0          73m
pod/build-v2-pod-5ff490                               0/1     Completed   0          44m
pod/my-app-v2-deployment-59d4f99745-hpjdj             2/2     Running     0          14s
pod/pipeline-run-v1-build-my-app-q2kf5-pod-6518f7     0/3     Completed   0          8m19s
pod/pipeline-run-v1-deploy-my-app-h5qmr-pod-acd39d    0/2     Completed   0          6m13s
pod/pipeline-run-v1-test-my-app-pgxvc-pod-5062a6      0/3     Completed   0          9m14s
pod/task-run-test-pod-0adeaa                          0/3     Completed   0          24m

NAME                                 URL                                         LATESTCREATED   LATESTREADY   READY   REASON
service.serving.knative.dev/my-app   http://my-app.default.35.188.22.28.nip.io   my-app-v2       my-app-v2     True
```

- Verify that the image `tekton-demo:1.0-tekton` is pushed to your Docker Hub repository.
- Verify that the site is updated - http://my-app.default.35.188.22.28.nip.io (adjust your ingress IP accordingly).
