// noinspection JSUnresolvedFunction

import { getDevnetId } from '../common/config-utils'

const shell = require('shelljs')

export async function terraformDestroy() {
  console.log('📍Executing terraform destroy...')
  require('dotenv').config({ path: `${process.cwd()}/.env` })
  shell.exec('terraform destroy -auto-approve -var-file=./secret.tfvars', {
    env: {
      ...process.env
    }
  })
  if (shell.error() == null) {
    const devnetId = getDevnetId()
    console.log(`📍Deleting ./deployments/devnet-${devnetId} folder...`)
    shell.exec(`cd ../../ && rm -rf ./deployments/devnet-${devnetId}`)
    console.log(`📍devnet-${devnetId} successfully destroyed!`)
  }
}
