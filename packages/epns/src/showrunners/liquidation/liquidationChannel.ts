import abi from './abi.json';
import escrowAbi from './escrowAbi.json';

import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import config, { defaultSdkSettings } from '../../config';
import { EPNSChannel } from '../../helpers/epnschannel';

@Service()
export default class LiquidationChannel extends EPNSChannel {
    LAST_CHECKED_BLOCK;
  constructor(@Inject('logger') public logger: Logger, @Inject('cached') public cached) {
    super(logger, {
      sdkSettings: {
        epnsCoreSettings: defaultSdkSettings.epnsCoreSettings,
        epnsCommunicatorSettings: defaultSdkSettings.epnsCommunicatorSettings,
        networkSettings: defaultSdkSettings.networkSettings,
      },
      networkToMonitor: config.web3MainnetNetwork,
      dirname: __dirname,
      name: 'PayPay Liquidation',
      url: 'https://paypay.io',
      useOffChain: true,
    });

    this.LAST_CHECKED_BLOCK = 0;
    this.ESCROWS = [];
  }

  async sendLiquidationEventNotif() {
    const sdk = await this.getSdk();
    const factory = await sdk.getContract('<factorycontract>', JSON.stringify(abi));
    const filter = await factory.contract.filters.TransferEscrow();

    if (this.LAST_CHECKED_BLOCK === 0) {
      this.LAST_CHECKED_BLOCK = await factory.provider.getBlockNumber();
    }

    const toBlock = await factory.provider.getBlockNumber();
    this.logInfo(`No of events fetching events from  ${this.LAST_CHECKED_BLOCK} to ${toBlock}`);

    const events = await factory.contract.queryFilter(filter, this.LAST_CHECKED_BLOCK, toBlock);

    this.logInfo(`No of events fetched ${events.length}`);

    for (const evt of events) {
        this.ESCROWS.append(evt.args.escrowAddress);
    }

    for (const escrow of this.ESCROWS) {
        const escrowContract = await sdk.getContract(escrow, JSON.stringify(escrowAbi));

        if(await escrowContract.hasDefaulted()) {
            const msg = `Escrow #${escrow} defaulted`;
            const payloadMsg = `Escrow #${escrow} defaulted`;
            const title = `Escrow Transferred`;
            const payloadTitle = `Escrow Transferred`;

            // lender
            await this.sendNotification({
                title: title,
                payloadTitle: payloadTitle,
                message: msg,
                payloadMsg: payloadMsg,
                notificationType: 1,
                recipient: await escrowContract.getLender(),
                cta: `https://paypay.io/escrow/${escrow}/liquidate`,
                simulate: false,
                image: null,
            });

            // borrower
            await this.sendNotification({
                title: title,
                payloadTitle: payloadTitle,
                message: msg,
                payloadMsg: payloadMsg,
                notificationType: 1,
                recipient: await escrowContract.getBorrower(),
                cta: `https://paypay.io/escrow/${escrow}/refinance`,
                simulate: false,
                image: null,
            });
        }
    }


    

    this.LAST_CHECKED_BLOCK = toBlock;
  }
}