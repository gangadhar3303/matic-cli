// noinspection JSCheckFunctionSignatures, JSUnresolvedFunction

import yaml from 'js-yaml'
import fs from 'fs'
import { cleanEnv, num, bool, url, host, makeValidator } from 'envalid'

const shell = require('shelljs')

const validStr = makeValidator((x) => {
  if (x !== undefined && x !== null && x !== '') return x
  else throw new Error(x + 'is not valid, please check your configs!')
})

const validBorChainId = makeValidator((x) => {
  if (x !== undefined && x !== null && (x.match(/^$/g) || x > 0)) return x
  else throw new Error(x + 'is not valid, please check your configs!')
})

const validHeimdallChainId = makeValidator((x) => {
  if (
    x !== undefined &&
    x !== null &&
    (x.match(/^$|heimdall-\d+$/g) || x > 0)
  ) {
    return x
  } else throw new Error(x + 'is not valid, please check your configs!')
})

const validVmImageStr = makeValidator((x) => {
  if (x !== undefined && x !== null && x !== '' && x.startsWith('ubuntu-')) {
    return x
  } else throw new Error(x + 'is not valid, please check your configs!')
})

const validCertPathStr = makeValidator((x) => {
  if (
    x !== undefined &&
    x !== null &&
    x !== '' &&
    !x.startsWith('~') &&
    (x.endsWith('.pem') || x.endsWith('.cer'))
  ) {
    return x
  } else throw new Error(x + 'is not valid, please check your configs!')
})

const validZone =  makeValidator((x) => {
  if (
    x !== undefined &&
    x !== null &&
    x !== '' &&
    x.startsWith(process.env.TF_VAR_REGION + '-')
  ) {
    return x
  } else throw new Error(x + 'is not valid, please check your configs!')
})

function validateEnvVars() {
  cleanEnv(process.env, {
    TF_VAR_VM_NAME: validStr({ default: 'polygon-user' }),
    TF_VAR_DOCKERIZED: validStr({ choices: ['yes', 'no'] }),
    TF_VAR_DISK_SIZE_GB: num({ default: 500 }),
    TF_VAR_VALIDATOR_COUNT: num({ default: 1 }),
    TF_VAR_SENTRY_COUNT: num({ default: 1 }),
    TF_VAR_MACHINE_TYPE: validStr({ default: 'c3-highcpu-22' }),
    TF_VAR_INSTANCE_IMAGE: validVmImageStr({ default: 'ubuntu-2204-jammy-v20230302' }),
    TF_VAR_REGION: validStr({
      default: 'us-west-2',
      choices: [
        "asia-east1",
        "asia-east2",
        "asia-northeast1",
        "asia-northeast2",
        "asia-northeast3",
        "asia-south1",
        "asia-south2",
        "asia-southeast1",
        "asia-southeast2",
        "australia-southeast1",
        "australia-southeast2",
        "europe-central2",
        "europe-north1",
        "europe-southwest1",
        "europe-west1",
        "europe-west2",
        "europe-west3",
        "europe-west4",
        "europe-west6",
        "europe-west8",
        "europe-west9",
        "me-west1",
        "northamerica-northeast1",
        "northamerica-northeast2",
        "southamerica-east1",
        "southamerica-west1",
        "us-central1",
        "us-east1",
        "us-east4",
        "us-east5",
        "us-south1",
        "us-west1",
        "us-west2",
        "us-west3",
        "us-west4"
      ],
      docs:
        'https://cloud.google.com/compute/docs/regions-zones'
    }),
    TF_VAR_ZONE: validZone({ default: 'us-central1-a' }),
    PEM_FILE_PATH: validCertPathStr({ default: '/home/ubuntu/ubuntu.pem' }),
    TF_VAR_GCE_PUB_KEY_FILE: validStr({ default: '/home/ubuntu/ubuntu.pem.pub' }),
    DEFAULT_STAKE: num({ default: 10000 }),
    DEFAULT_FEE: num({ default: 2000 }),
    BOR_CHAIN_ID: validBorChainId({ default: '15005' }),
    HEIMDALL_CHAIN_ID: validHeimdallChainId({ default: 'heimdall-4052' }),
    SPRINT_SIZE: num({ default: 64 }),
    BLOCK_NUMBER: validStr({ default: '0,64' }),
    BLOCK_TIME: validStr({ default: '3,2' }),
    BOR_REPO: url({
      default: 'https://github.com/maticnetwork/bor.git'
    }),
    BOR_BRANCH: validStr({ default: 'develop' }),
    HEIMDALL_REPO: url({
      default: 'https://github.com/maticnetwork/heimdall.git'
    }),
    HEIMDALL_BRANCH: validStr({ default: 'develop' }),
    CONTRACTS_REPO: url({
      default: 'https://github.com/maticnetwork/contracts.git'
    }),
    CONTRACTS_BRANCH: validStr({ default: 'master' }),
    GENESIS_CONTRACTS_REPO: url({
      default: 'https://github.com/maticnetwork/genesis-contracts.git'
    }),
    GENESIS_CONTRACTS_BRANCH: validStr({ default: 'master' }),
    MATIC_CLI_REPO: url({
      default: 'https://github.com/maticnetwork/matic-cli.git'
    }),
    MATIC_CLI_BRANCH: validStr({ default: 'master' }),
    DEVNET_BOR_USERS: validStr({ default: 'ubuntu,ubuntu' }),
    INSTANCES_IDS: validStr({
      default: 'i-02a1f3a2884c9edbc,i-03b2d4b3014a4becd'
    }),
    BOR_DOCKER_BUILD_CONTEXT: url({
      default: 'https://github.com/maticnetwork/bor.git#develop'
    }),
    HEIMDALL_DOCKER_BUILD_CONTEXT: url({
      default: 'https://github.com/maticnetwork/heimdall.git#develop'
    }),
    VERBOSE: bool({ default: true }),
    DD_API_KEY: validStr({ default: 'DATADOG_API_KEY' }),
    MNEMONIC: validStr({
      default:
        'clock radar mass judge dismiss just intact ' +
        'mind resemble fringe diary casino'
    }),
    SPEED: num({ default: 200 }),
    MAX_ACCOUNTS: num({ default: 100000 }),
    FUND: bool({ default: true }),
    STRESS_DEBUG_LOGS: bool({ default: true }),
    BURN_CONTRACT_ADDRESS: validStr({
      default: '0x000000000000000000000000000000000000dead'
    }),
    MAX_FEE: num({ default: 30000000009 }),
    MAX_PRIORITY_FEE: num({ default: 30000000000 }),
    COUNT: num({ default: 100 })
  })
}

// TODO: Update the below function according to GCP
function validateAwsKeyAndCertificate() {
  const certFilePath = process.env.PEM_FILE_PATH
  const certName = certFilePath
    .substring(certFilePath.lastIndexOf('/') + 1)
    .split('.')[0]
  if (certName !== process.env.TF_VAR_PEM_FILE) {
    console.log(
      '❌ PEM_FILE_PATH and TF_VAR_PEM_FILE are inconsistent, please check your configs!'
    )
    process.exit(1)
  }
}

function validateUsersAndHosts() {
  console.log('📍Validating DEVNET_BOR_USERS and DEVNET_BOR_HOSTS...')
  const borUsers = process.env.DEVNET_BOR_USERS.split(',')
  const borHosts = process.env.DEVNET_BOR_HOSTS.split(',')
  const valCount = Number(process.env.TF_VAR_VALIDATOR_COUNT)
  const senCount = Number(process.env.TF_VAR_SENTRY_COUNT)
  const archiveCount = Number(process.env.TF_VAR_ARCHIVE_COUNT)
  if (
    process.env.TF_VAR_DOCKERIZED === 'yes' &&
    borUsers.length !== valCount + senCount + archiveCount
  ) {
    console.log(
      '❌ DEVNET_BOR_USERS lengths are not equal to the nodes count ' +
        '(TF_VAR_VALIDATOR_COUNT+TF_VAR_SENTRY_COUNT+TF_VAR_ARCHIVE_COUNT), please check your configs!'
    )
    process.exit(1)
  } else if (
    process.env.TF_VAR_DOCKERIZED === 'no' &&
    (borUsers.length !== borHosts.length ||
      borUsers.length !== valCount + senCount + archiveCount ||
      borHosts.length !== valCount + senCount + archiveCount)
  ) {
    console.log(
      '❌ DEVNET_BOR_USERS or DEVNET_BOR_HOSTS lengths are not equal to the nodes count ' +
        '(TF_VAR_VALIDATOR_COUNT+TF_VAR_SENTRY_COUNT+TF_VAR_ARCHIVE_COUNT), please check your configs!'
    )
    process.exit(1)
  }

  borUsers.forEach((user) => {
    if (user !== 'ubuntu') {
      console.log(
        "❌ DEVNET_BOR_USERS must all be named 'ubuntu', please check your configs!"
      )
      process.exit(1)
    }
  })
  borHosts.forEach((borHost) => {
    host(borHost)
  })
}

function validateBlockParams() {
  console.log(
    '📍Validating genesis specific values BLOCK_NUMBER and BLOCK_TIME...'
  )
  const blockNumbers = process.env.BLOCK_NUMBER.split(',')
  const blockTimes = process.env.BLOCK_TIME.split(',')
  if (blockNumbers.length !== blockTimes.length) {
    console.log(
      '❌ BLOCK_NUMBER and BLOCK_TIME have different lengths, please check your configs!'
    )
    process.exit(1)
  }
}

function validateGitConfigs() {
  console.log('📍Validating git configs for all repos...')
  console.log('📍Validating bor...')
  shell.exec(
    `git ls-remote --exit-code --heads --tags ${process.env.BOR_REPO} ${process.env.BOR_BRANCH} ||
    git fetch ${process.env.BOR_REPO} ${process.env.BOR_BRANCH}`
  )
  if (shell.error() != null) {
    console.log(
      '❌ Error while test-cloning bor repo, please check your configs!'
    )
    process.exit(1)
  }
  console.log('📍Validating heimdall...')
  shell.exec(
    `git ls-remote --exit-code --heads --tags ${process.env.HEIMDALL_REPO} ${process.env.HEIMDALL_BRANCH} ||
    git fetch ${process.env.HEIMDALL_REPO} ${process.env.HEIMDALL_BRANCH}`
  )
  if (shell.error() != null) {
    console.log(
      '❌ Error while test-cloning heimdall repo, please check your configs!'
    )
    process.exit(1)
  }
  console.log('📍Validating matic-cli...')
  shell.exec(
    `git ls-remote --exit-code --heads --tags ${process.env.MATIC_CLI_REPO} ${process.env.MATIC_CLI_BRANCH} ||
    git fetch ${process.env.MATIC_CLI_REPO} ${process.env.MATIC_CLI_BRANCH}`
  )
  if (shell.error() != null) {
    console.log(
      '❌ Error while test-cloning matic-cli repo, please check your configs!'
    )
    process.exit(1)
  }
  console.log('📍Validating contracts...')
  shell.exec(
    `git ls-remote --exit-code --heads --tags ${process.env.CONTRACTS_REPO} ${process.env.CONTRACTS_BRANCH} ||
    git fetch ${process.env.CONTRACTS_REPO} ${process.env.CONTRACTS_BRANCH}`
  )
  if (shell.error() != null) {
    console.log(
      '❌ Error while test-cloning contracts repo, please check your configs!'
    )
    process.exit(1)
  }
  console.log('📍Validating genesis-contracts...')
  shell.exec(
    `git ls-remote --exit-code --heads --tags ${process.env.GENESIS_CONTRACTS_REPO} ${process.env.GENESIS_CONTRACTS_BRANCH} ||
    git fetch ${process.env.GENESIS_CONTRACTS_REPO} ${process.env.GENESIS_CONTRACTS_BRANCH}`
  )
  if (shell.error() != null) {
    console.log(
      '❌ Error while cloning genesis-contracts repo, please check your configs!'
    )
    process.exit(1)
  }
}

function setCommonConfigs(doc) {
  setConfigValue('defaultStake', parseInt(process.env.DEFAULT_STAKE), doc)
  setConfigValue('defaultFee', parseInt(process.env.DEFAULT_FEE), doc)

  let borChainId, heimdallChainId

  if (!process.env.BOR_CHAIN_ID && !process.env.HEIMDALL_CHAIN_ID) {
    borChainId = Math.floor(Math.random() * 10000 + 1000)
    setConfigValue('borChainId', parseInt(borChainId), doc)
    setConfigValue('heimdallChainId', 'heimdall-' + borChainId, doc)
  } else if (!process.env.BOR_CHAIN_ID) {
    try {
      if (process.env.HEIMDALL_CHAIN_ID > 0) {
        borChainId = process.env.HEIMDALL_CHAIN_ID
        heimdallChainId = 'heimdall-' + process.env.HEIMDALL_CHAIN_ID
      } else {
        borChainId = process.env.HEIMDALL_CHAIN_ID.split('-')[1]
      }

      setConfigValue('borChainId', parseInt(borChainId), doc)
      setConfigValue('heimdallChainId', heimdallChainId, doc)
    } catch (error) {
      console.log(
        '❌ Error occured while processing heimdall chain id (Heimdall chain id should be like: heimdall-4052)!'
      )
      process.exit(1)
    }
  } else if (!process.env.HEIMDALL_CHAIN_ID) {
    borChainId = process.env.BOR_CHAIN_ID
    setConfigValue('borChainId', parseInt(process.env.BOR_CHAIN_ID), doc)
    setConfigValue('heimdallChainId', 'heimdall-' + borChainId, doc)
  } else {
    if (process.env.HEIMDALL_CHAIN_ID > 0) {
      heimdallChainId = 'heimdall-' + process.env.HEIMDALL_CHAIN_ID
    } else {
      heimdallChainId = process.env.HEIMDALL_CHAIN_ID
    }

    setConfigValue('heimdallChainId', heimdallChainId, doc)
    setConfigValue('borChainId', parseInt(process.env.BOR_CHAIN_ID), doc)
  }

  setConfigList('sprintSize', process.env.SPRINT_SIZE, doc)
  setConfigList(
    'sprintSizeBlockNumber',
    process.env.SPRINT_SIZE_BLOCK_NUMBER,
    doc
  )
  setConfigList('blockNumber', process.env.BLOCK_NUMBER, doc)
  setConfigList('blockTime', process.env.BLOCK_TIME, doc)
  setConfigValue('borRepo', process.env.BOR_REPO, doc)
  setConfigValue('borBranch', process.env.BOR_BRANCH, doc)
  setConfigValue('heimdallRepo', process.env.HEIMDALL_REPO, doc)
  setConfigValue('heimdallBranch', process.env.HEIMDALL_BRANCH, doc)
  setConfigValue('contractsRepo', process.env.CONTRACTS_REPO, doc)
  setConfigValue('contractsBranch', process.env.CONTRACTS_BRANCH, doc)
  setConfigValue(
    'genesisContractsRepo',
    process.env.GENESIS_CONTRACTS_REPO,
    doc
  )
  setConfigValue(
    'genesisContractsBranch',
    process.env.GENESIS_CONTRACTS_BRANCH,
    doc
  )
  setConfigValue(
    'numOfValidators',
    parseInt(process.env.TF_VAR_VALIDATOR_COUNT),
    doc
  )
  setConfigValue(
    'numOfNonValidators',
    parseInt(process.env.TF_VAR_SENTRY_COUNT),
    doc
  )
  setConfigValue(
    'numOfArchiveNodes',
    parseInt(process.env.TF_VAR_ARCHIVE_COUNT),
    doc
  )
  setConfigValue('ethHostUser', process.env.ETH_HOST_USER, doc)
  setConfigValue(
    'borDockerBuildContext',
    process.env.BOR_DOCKER_BUILD_CONTEXT,
    doc
  )
  setConfigValue(
    'heimdallDockerBuildContext',
    process.env.HEIMDALL_DOCKER_BUILD_CONTEXT,
    doc
  )
  setConfigList('instancesIds', process.env.INSTANCES_IDS, doc)
}

function setConfigValue(key, value, doc) {
  if (value !== undefined) {
    doc[key] = value
  }
}

function setConfigList(key, value, doc) {
  if (value !== undefined) {
    value = value.split(' ').join('')
    const valueArray = value.split(',')
    if (valueArray.length > 0) {
      doc[key] = []
      for (let i = 0; i < valueArray.length; i++) {
        doc[key][i] = valueArray[i]

        if (i === 0) {
          if (key === 'devnetBorHosts') {
            setEthURL(valueArray[i], doc)
          }
          if (key === 'devnetBorUsers') {
            setEthHostUser(valueArray[i], doc)
          }
        }
      }
    }
  }
}

function setEthURL(value, doc) {
  if (value !== undefined) {
    doc.ethURL = 'http://' + value + ':9545'
    process.env.ETH_URL = doc.ethURL
  }
}

function setEthHostUser(value, doc) {
  if (value !== undefined) {
    doc.ethHostUser = value
  }
}

export function splitToArray(value) {
  try {
    return value.split(' ').join('').split(',')
  } catch (error) {
    console.error('📍Failed to split to IP array: ', error)
    console.log('📍Exiting...')
    process.exit(1)
  }
}

export function splitAndGetHostIp(value) {
  try {
    return value.split('@')[0]
  } catch (error) {
    console.error('📍Failed to split IP: ', error)
    console.log('📍Exiting...')
    process.exit(1)
  }
}

export async function checkAndReturnVMIndex(n, doc) {
  if (typeof n === 'boolean') {
    console.log('📍Targeting all VMs ...')
    return undefined
  }

  if (typeof n === 'string') {
    const vmIndex = parseInt(n, 10)
    if (vmIndex >= 0 && vmIndex < doc.devnetBorHosts.length) {
      console.log(`📍Targeting VM with IP ${doc.devnetBorHosts[vmIndex]} ...`)
      return vmIndex
    } else {
      console.log('📍Wrong VM index, please check your configs! Exiting...')
      process.exit(1)
    }
  }
}

export function getDevnetId() {
  const devnetFolders = process.cwd().split('/')
  const ids = devnetFolders[devnetFolders.length - 1].split('-')
  return ids[1]
}

export async function loadDevnetConfig(devnetType) {
  return yaml.load(
    fs.readFileSync(`./${devnetType}-setup-config.yaml`, 'utf-8')
  )
}

export async function editMaticCliRemoteYAMLConfig() {
  console.log('📍Editing matic-cli remote YAML configs...')

  const doc = await yaml.load(
    fs.readFileSync(`${process.cwd()}/remote-setup-config.yaml`, 'utf8'),
    undefined
  )

  setCommonConfigs(doc)
  setConfigList('devnetBorHosts', process.env.DEVNET_BOR_HOSTS, doc)
  setConfigList('devnetHeimdallHosts', process.env.DEVNET_BOR_HOSTS, doc)
  setConfigList('devnetBorUsers', process.env.DEVNET_BOR_USERS, doc)
  setConfigList('devnetHeimdallUsers', process.env.DEVNET_BOR_USERS, doc)
  setConfigValue('devnetType', 'remote', doc)
  setConfigValue('devnetRegion', process.env.TF_VAR_REGION, doc)
  setConfigValue('devnetZone', process.env.TF_VAR_ZONE, doc)

  fs.writeFile(
    `${process.cwd()}/remote-setup-config.yaml`,
    yaml.dump(doc),
    (err) => {
      if (err) {
        console.log('❌ Error while writing remote YAML configs: \n', err)
        process.exit(1)
      }
    }
  )
}

export async function editMaticCliDockerYAMLConfig() {
  console.log('📍Editing matic-cli docker YAML configs...')

  const doc = await yaml.load(
    fs.readFileSync(`${process.cwd()}/docker-setup-config.yaml`, 'utf8'),
    undefined
  )

  setCommonConfigs(doc)
  setEthHostUser('ubuntu', doc)
  setConfigList('devnetBorHosts', process.env.DEVNET_BOR_HOSTS, doc)
  setConfigValue('devnetBorUsers', process.env.DEVNET_BOR_USERS, doc)
  setConfigValue('devnetType', 'docker', doc)
  setEthURL('ganache', doc)

  fs.writeFile(
    `${process.cwd()}/docker-setup-config.yaml`,
    yaml.dump(doc),
    (err) => {
      if (err) {
        console.log('❌ Error while writing docker YAML configs: \n', err)
        process.exit(1)
      }
    }
  )
}

export async function validateConfigs() {
  validateEnvVars()
  // TODO: validate GCP pub and private keys
  // validateAwsKeyAndCertificate()
  validateUsersAndHosts()
  validateBlockParams()
  validateGitConfigs()
}
