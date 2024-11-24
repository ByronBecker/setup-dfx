import * as core from '@actions/core';
import * as io from '@actions/io';
import cp from 'child_process';
import os from 'os';
import {gte} from "semver";

export async function run() {
    // Configured to run on linux by default.
    let bin = '/home/runner/bin';
    let vesselBuild = 'linux64';
    let pocketicBuild = 'linux';

    // Alter params if running on  macOS.
    if (os.platform() === 'darwin') {
        bin = '/Users/runner/bin';
        vesselBuild = 'macos';
        pocketicBuild = 'darwin';
    }

    // Die if not running on linux or macOS.
    if (!['linux', 'darwin'].includes(os.platform())) {
        core.setFailed(`Action not supported for: ${os.platform()} ${os.arch()}.`)
        return;
    }

    // Add bin to path.
    cp.execSync(`mkdir -p ${bin}`);
    core.addPath(bin);

    // Install vessel.
    const vesselVersion = core.getInput('vessel-version');
    if (vesselVersion) {
        cp.execSync(
            `wget -O ${bin}/vessel https://github.com/dfinity/vessel/releases/download/v${vesselVersion}/vessel-${vesselBuild}`
        );
        cp.execSync(`chmod +x ${bin}/vessel`);

        const vesselPath = await io.which('vessel');
        infoExec(`${vesselPath} --version`);
    }
}

function infoExec(command: string): string {
    const cmdStr = (cp.execSync(command) || '').toString();
    core.info(cmdStr);
    return cmdStr;
}
