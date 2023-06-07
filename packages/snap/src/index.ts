import {OnRpcRequestHandler, OnTransactionHandler} from '@metamask/snaps-types';
import {heading, panel, text} from '@metamask/snaps-ui';

import {hasProperty, isObject} from '@metamask/utils';

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


export const onRpcRequest: OnRpcRequestHandler = async ({origin, request}) => {
  const spotterResponse = await fetch(
    `https://thoqaobf86.execute-api.us-east-2.amazonaws.com/v0/snap?addr=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`,
  );

  const res = await spotterResponse.json();

  isHighDetected = true;

  return snap.request({
    method: 'snap_dialog',
    params: {
      type: 'prompt',
      content: panel([
        heading(`You are about to sign ${getColor(1)  } security risk`),
        text(`Please Confirm by typing YES${JSON.stringify(res, null, 2)}`),
        text(`Rpc request: ${request}`),
      ]),
      placeholder: 'placeholder',
    },
  });
};

export const onTransaction: OnTransactionHandler = async ({transaction}) => {
  const targetContractAddress = transaction.to;

  let riskScore = 0;

  if (targetContractAddress === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
    riskScore = 2;
  } else if (
    targetContractAddress === '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'
  ) {
    riskScore = 3;
  }

  // const spotterResponse = await fetch(
  //   `https://thoqaobf86.execute-api.us-east-2.amazonaws.com/v0/snap?addr=${targetContractAddress}`,
  // );
  //
  // const spotterResponseJSON = await spotterResponse.json();
  return {
    content: panel([
      heading(`${getColor(riskScore)} security`),
      text(`targetContractAddress: ${targetContractAddress}`),
      // text(`Response from Spooter: ${spotterResponseJSON}`),
      text(
        `You are about to sign contract with ${getColor(riskScore)} security`,
      ),
    ]),
  };
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
