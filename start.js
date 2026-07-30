const { spawn } = require('child_process');

function startProcess(name, command, args, cwd) {
  console.log(`Starting ${name} via '${command} ${args.join(' ')}' in ${cwd}...`);
  const proc = spawn(command, args, { cwd, shell: true });

  proc.stdout.on('data', (data) => {
    process.stdout.write(`[${name}] ${data}`);
  });

  proc.stderr.on('data', (data) => {
    process.stderr.write(`[${name}] ERR: ${data}`);
  });

  proc.on('close', (code) => {
    console.log(`[${name}] Process exited with code ${code}. Restarting in 2s...`);
    setTimeout(() => startProcess(name, command, args, cwd), 2000);
  });

  return proc;
}

// 1. Start victim backend
startProcess('Backend', 'npm', ['start'], './backend');

// 2. Start Python orchestrator daemon
startProcess('Orchestrator', 'python3', ['daemon.py'], './orchestrator');

// 3. Start unified gateway proxy
startProcess('Gateway', 'node', ['gateway.js'], '.');
