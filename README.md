# generator-helpi
> A [Yeoman](http://yeoman.io)
 generator that provides commands for setting up a Hapi app. It ships out of the box with a Hapi skeleton that is ready to be ran inside a Docker container via Vagrant.

**NOTE:** This module is under development

## Getting Started

### Dependencies

This generator assumes you are using Vagrant with Virtualbox for development environments. It also assumes you have Yeoman installed on your local machine.

### Setup Yeoman

Install the Yoeman CLI as a global NPM package

```bash
npm install -g yo
```

To install generator-hapi-vagrant-docker from npm, run:

```bash
npm install -g generator-helpi
```

Finally, initiate the generator:

```bash
yo helpi
```

### Get Vagrant + Virtualbox

Head on over to http://vagrantup.com and download the [latest](https://www.vagrantup.com/downloads.html) version of Vagrant.

You will also need to download the [latest](https://www.virtualbox.org/wiki/Downloads) version of Virtualbox.

### Rsync

Part of the development workflow of using Vagrant managed VMs for development is making sure that your code from you local is sync'd into the VM, and re-sync'd every time a change is made.

Helpi uses the built in rsync capabilities that ship in Vagrant to do this. In order to use these features, you will need to have `rsync` installed on your local machine. OS X ships with a version pre-installed. Linux users may need to install it with a package manager.

## Docker

You should install the Docker client on your local machine so you can use it to interact with the Docker host that is built.

### On OS X

Use [Homebrew](http://brew.sh/) to install the Docker CLI by running:

```bash
brew install docker
```

## Commands

### `yo helpi`

This generator will build a full app skeleton for a Hapi app that is ready to be ran inside a Docker container via Vagrant and Virtualbox.

**Note:** Make sure you are inside the directory that you want to use as your project root when you run this command.

## Usage

### Start Docker container

Once your app skeleton has been produced, you are ready to spin up your application container.

From the project root, run:

```bash
vagrant up
```

This will spin up a Docker host and build the container into the Docker host.

By default, the Dockerhost spins up on the local IP `192.168.100.100`. You can now add the following lines to your shell profile to be able to use the `docker` cli to interact with the Docker host:

```bash
export DOCKER_HOST=tcp://192.168.100.100:2375
```

You will now be able to run `docker` commands from the command line and they will be run against this host. For example, run the following to see a list of all running containers:

```bash
docker ps
```

You should get output that looks like the following:

```
CONTAINER ID        IMAGE                 COMMAND
46507a4e829e        user/app-name:latest  "./bin/dev.sh"
2a6ff275a5af        mongo:2               "/entrypoint.sh mong
```

### Access app

You should now be able to access the hello world module that the skeleton ships with by going to http://192.168.100.100:8000/hello. 

**Note:** if you changed the port the app spins up on during your `yo helpi` build, the app port above may not be accurate, and you will need to use the port you selected.

### Connect to running container

After running `docker ps` you will be able to see the container ID of the running app container. To open a shell into the running container, run:

```bash
docker exec -it CONTAINER_ID bash
```

### Syncing files to the Container

The Vagrant config will rsync the application to the Docker host, and mount the rsync'd folder to the container as a Volume.

To make sure that you file changes are sent to the Container, you should run `vagrant rsync-auto` and it will stay running, watching the project folder for changes and syncing them.

### Installing NPM Modules

Get a shell inside the container, and use `npm install --save MODULE` or `npm install --save-dev MODULE` to install it inside the container. Since `vagrant rsync-auto` is not bi-directional, after you are done installing, make sure you bring the modified `package.json` back to the host by copying the output of `cat package.json` and pasting it into your IDE so it can be comitted to Git.

### Debugging

A debugger is ready to go inside the container. In order to activate it, you will need to add a file to the root of the project folder named `.myenvvars` and add the following:

```bash
export DEBUGGER=true
```

Since the env var added to that file needs to be picked up by the container start script, you will need to make sure that the updated file was sent into the container via `vagrant rsync-auto` and then you can restart the container by running `docker restart CONTAINER_ID`

Once the app has been started with the Debugger turned on, you can connect to the debugger at the following URL:

http://192.168.100.100:8080/debug?port=5858

**Note:** if you changed the port the debug UI and debugger spins up on during your `yo helpi` build, the ports above may not be accurate, and you will need to use the ports you selected.

### Testing

The application is being tested using the [Lab](https://github.com/hapijs/lab) testing framework. All modules added to the app should have corrisponding tests produced for them.

To run tests, run the following command from inside the container:

```bash
npm test
```

### Sharng your Docker host across multiple projects

The Vagrantfile that is created for this project is capable of using a global Docker host that can be used across multiple projects. The benefit of this is that any Docker container images that have been pulled in the shared host will be available and chaced for subsequent projects, speeding up project creation.

In order to to tell the Vagrant file that a shared Docker host is in use, you need to set the following ENV vars in your shell profile:

```bash
export DOCKER_HOST_VAGRANT_FILE=....
export DOCKER_HOST_VAGRANT_NAME="...."
```

You will need to set the value of `DOCKER_HOST_VAGRANT_FILE` to a path where the shared Docker host vagrant file exists. You can use the `docker/Dockerhost` file in the app skeleton as an example of what this looks like.

You will need to change the value of `DOCKER_HOST_VAGRANT_NAME` to the name you setup in your shared Docker host Vagrant file.

Example:

```bash
export DOCKER_HOST_VAGRANT_FILE=$HOME/Workspace/docker/Dockerhost
export DOCKER_HOST_VAGRANT_NAME="my-docker-host"
```

## License

MIT
