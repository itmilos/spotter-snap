import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */


const getColor = (result: number) => {
  switch (result) {
    case 3:
      return '🟩';
    case 2:
      return '🟧';
    default:
      return '🟥';
  }
};


export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        // method: 'snap_dialog',
        // params: {
        //   type: 'confirmation',
        //   content: panel([
        //     text("You are about to sign contract with " + getColor(3) + " security"),
        //   ]),
        // },
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          content: panel([
            heading('You are about to singn' + getColor(1) + ' security'),
            text('Please Confirm by typing YES'),
          ]),
          placeholder: 'placeholder',
        },
      });
    default:
      throw new Error('Method not found.');
  }
};

//
// const contractVerificationScore = await getContractVerificationScore({
//   chainId,
//   contractAddress: (transaction as TransactionObject).to,
// });
//
// const overallScore = calculateOverallScoreWithWeight({
//   contractTransactionCountScore,
//   contractUserTransactionScore,
//   contractAgeScore,
//   contractVerificationScore,
// });
//
//
