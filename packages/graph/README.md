## graph

The Graph is a tool for for indexing events emitted on the Ethereum blockchain. It provides you with an easy-to-use GraphQL API.

## How to run

0. Clean data `yarn clean-graph-node`
1. Run `yarn network:mainnet-fork` or `yarn network:testnet`, depending on the network to use and deploy contracts
2. Change `config/<network>.json` replacing addresses with latest/local deployments and editing `startBlock` with the one when protocol was deployed. Launch `yarn prepare:<network>` to build `subgraph.yml`.
3. Run a local instance of graph node via `yarn run-graph-node`
4. Launch `yarn codegen && yarn build` to create subgraph structures
5. Deploy subgraph `yarn create:local && yarn ship:local`
6. Tidy up environment `yarn remove:local && yarn remove-graph-node && yarn clean-graph-node`
7. Play with the protocol and query at `http://localhost:8000/subgraphs/name/paypay/paypay/graphql`

```graphql

```

## Available Scripts

In the project directory, you can run:

### Subgraph

#### `yarn codegen`

Generates AssemblyScript types for smart contract ABIs and the subgraph schema.

#### `yarn build`

Compiles the subgraph to WebAssembly.

#### `ganache-cli`

Run a local testnet.

#### `yarn run-graph-node`

Run a local graph instance.

#### `yarn prepare:<network>`

Build `<network>` subgraph.yaml from template. Use `local` for local testing.

#### `yarn create:local`

Create locally the subgraph.

#### `yarn deploy:local`

Deploy locally the subgraph.

#### `yarn remove:local`

Remove locally the subgraph.

#### `yarn remove-graph-node && yarn clean-graph-node`

Run a local graph instance.

#### `yarn ship:<network>`

Deploy the subgraph for the `<network>`.