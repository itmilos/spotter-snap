import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';

import { hasProperty, isObject } from '@metamask/utils';

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

let isHighDetected = false;

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


export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  const response = await fetch(
    `https://catfact.ninja/fact`,
  );

  const res = await response.json();

  isHighDetected = true;



  switch (request.method) {
    // case 'security_risk':
    //   return snap.request({
    //     method: 'snap_dialog',
    //     params: {
    //       type: 'prompt',
    //       content: panel([
    //         heading('You are about to sign ' + getColor(1) + ' security risk'),
    //         text('Please Confirm by typing YES'),
    //       ]),
    //       placeholder: 'placeholder',
    //     },
    //   });
    // case 'security_mid':
    //   return snap.request({
    //     content: panel([
    //       heading(getColor(2) + ' security risk'),
    //       text('You are about to sign ' + getColor() + ' security'),
    //     ])
    //   });
    // case 'security_norisk':
    //   return snap.request({
    //     method: 'snap_dialog',
    //     params: {
    //       type: 'prompt',
    //       content: panel([
    //         heading(getColor() + ' security'),
    //         text('You are about to sign ' + getColor() + ' security'),
    //       ]),
    //       placeholder: 'placeholder',
    //     },
    //   });
    // case 'hello1':
    //   return snap.request({
    //     // method: 'snap_dialog',
    //     // params: {
    //     //   type: 'confirmation',
    //     //   content: panel([
    //     //     text("You are about to sign contract with " + getColor(3) + " security"),
    //     //   ]),
    //     // },
    //     method: 'snap_dialog',
    //     params: {
    //       type: 'prompt',
    //       content: panel([
    //         heading('You are about to singn' + getColor(1) + ' security'),
    //         text('Please Confirm by typing YES'),
    //       ]),
    //       placeholder: 'placeholder',
    //     },
    //   });
    default:
      return snap.request({
            method: 'snap_dialog',
            params: {
              type: 'prompt',
              content: panel([
                heading('You are about to sign ' + getColor(1) + ' security risk'),
                text('Please Confirm by typing YES' + JSON.stringify(res, null, 2))
              ]),
              placeholder: 'placeholder',
            },
          });
  }
};


export const onTransaction: OnTransactionHandler = async ({ transaction }) => {


  if (
    !isObject(transaction) ||
    !hasProperty(transaction, 'data') ||
    typeof transaction.data !== 'string'
  ) {
    console.warn('Unknown transaction type.');
    return { content: text("You are about to sign contract with " + getColor(3) + " security") };
  }
};

//
// export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
//
//   // Use the window.ethereum global provider to fetch the gas price.
//   const currentGasPrice = await window.ethereum.request({
//     method: 'eth_gasPrice',
//   });
//
//   // Get fields from the transaction object.
//   const transactionGas = parseInt(transaction.gas as string, 16);
//   const currentGasPriceInWei = parseInt(currentGasPrice ?? '', 16);
//   const maxFeePerGasInWei = parseInt(transaction.maxFeePerGas as string, 16);
//   const maxPriorityFeePerGasInWei = parseInt(
//     transaction.maxPriorityFeePerGas as string,
//     16,
//   );
//
//   // Calculate gas fees the user would pay.
//   const gasFees = Math.min(
//     maxFeePerGasInWei * transactionGas,
//     (currentGasPriceInWei + maxPriorityFeePerGasInWei) * transactionGas,
//   );
//
//   // Calculate gas fees as percentage of transaction.
//   const transactionValueInWei = parseInt(transaction.value as string, 16);
//   const gasFeesPercentage = (gasFees / (gasFees + transactionValueInWei)) * 100;
//
//   // Display percentage of gas fees in the transaction insights UI.
//   return {
//     content: panel([
//       heading('Transaction insights snap'),
//       text(
//         `As set up, you are paying **${gasFeesPercentage.toFixed(
//           2,
//         )}%** in gas fees for this transaction.`,
//       ),
//     ]),
//   };
// };
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
