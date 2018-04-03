const getPort = require('get-port');
const {spawn} = require('child_process');
const service = spawn('npm', ['start']);
const net = require('net');
const kill = require('tree-kill');

function startTest(serverPid, env) {

  const test = spawn('npx', ['react-scripts', 'test', '--env=jsdom'], {env: env});

  test.stdout.on('data', (data) => {
    console.log(`stdoutTest: ${data}`);
  });

  test.stderr.on('data', (data) => {
    console.log(`stderrTest: ${data}`);
  });

  test.on('exit', (code) => {
    console.log('exit', code);
    kill(serverPid);
    process.exit(code);
  });

  test.on('close', (code) => {
    console.log('close', code);
    kill(serverPid);
    process.exit(code);
  });

}

function start() {
  getPort().then(port => {
    const env = Object.create(process.env);
    env.PORT = port;
    env.REACT_APP_IS_E2E_TEST=true;
    env.CI = true;

    const onServerStdout = (data) => {
      console.log(`stdout: ${data}`);
      // there gotta be a way to check for react app to be compiled and served
      setTimeout(() => startTest(server.pid, env), 10000)
    };

    const onServerStderr = (data) => {
      console.log(`stderr: ${data}`);
    };

     const server = spawn('npx', ['react-scripts', 'start'], { env: env });
     server.stdout.on('data', onServerStdout);
     server.stderr.on('data', onServerStderr);

  });
}

start();
