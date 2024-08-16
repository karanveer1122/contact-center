const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();
const ssm = new AWS.SSM();
// import {getById, createItem} from '../../common/dynamoDocClient'
module.exports.handler = async (event) => {
  // function getById(params) {
  //   console.log(Key, { Key });
  //   let get = dynamodb.getItem(params).promise();
  //   return get
  //     .then((data) => {
  //       if ("Item" in data) return data.Item;
  //       return null;
  //     })
  //     .catch((err) => {
  //       throw new HttpError(
  //         502,
  //         `Could not get item from ${TableName} with key of ${JSON.stringify(
  //           Key
  //         )}.`,
  //         { err }
  //       );
  //     });
  // }

  async function createItem(params) {
    try {
      const data = await dynamodb.putItem(params).promise();
      console.log("data", data);
      return data;
    } catch (err) {
      return err;
    }
  }

  async function updateItem(params) {
    try {
      const data = await dynamodb.updateItem(params).promise();
      console.log("data", data);
      return data;
    } catch (error) {
      return error;
    }
  }

  let options = {
    Name: "contact_history_manual_table" /* required */,
    WithDecryption: false,
  };
  const contact_history_table = await ssm.getParameter(options).promise();
  console.log("value", contact_history_table.Parameter.Value);

  for (let index = 0; index < event.Records.length; index++) {
    let record = event.Records[index];
    console.info("eventname", record.eventName);

    if (record.eventName === "INSERT") {
      const contactId = record.dynamodb.NewImage.contactId.S;
      const timeStamp = record.dynamodb.NewImage.timeStamp.S;
      const customerId = record.dynamodb.NewImage.customerId.S;
      const customerName = record.dynamodb.NewImage.customerName.S;
      const channel = record.dynamodb.NewImage.channel.S;
      const type = record.dynamodb.NewImage.type.S;
      const contactStatus = record.dynamodb.NewImage.contactStatus.S;
      const agentId = record.dynamodb.NewImage.agentId.S;
      const agentName = record.dynamodb.NewImage.agentName.S;
      const queueId = record.dynamodb.NewImage.queueId.S;
      const redmineNumber = record.dynamodb.NewImage.redmineNumber.S;
      const recordingLink = record.dynamodb.NewImage.recordingLink.S;
      let getParams = {
        TableName: contact_history_table.Parameter.Value,
        Key: { contactId: { S: contactId } },
      };
      // const getParams = {
      //   TableName: contact_history_table.Parameter.Value,
      //   KeyConditionExpression: "contactId = :contactId",
      //   ExpressionAttributeValues: {
      //     ":contactId": contactId,
      //   },
      // };

      const isExist = await dynamodb.getItem(getParams).promise();
      console.log("isExist", isExist);
      try {
        if (isExist) {
        }
        const params = {
          Item: {
            contactId: {
              S: contactId,
            },
            timeStamp: {
              S: timeStamp,
            },
            customerId: {
              S: customerId,
            },
            customerName: {
              S: customerName,
            },
            channel: {
              S: channel,
            },
            type: {
              S: type,
            },
            contactStatus: {
              S: contactStatus,
            },
            agentId: {
              S: agentId,
            },
            agentName: {
              S: agentName,
            },
            queueId: {
              S: queueId,
            },
            redmineNumber: {
              S: redmineNumber,
            },
            recordingLink: {
              S: recordingLink,
            },
          },
          ReturnConsumedCapacity: "TOTAL",
          TableName: contact_history_table.Parameter.Value,
        };
        const data = await createItem(params);
        console.log("data", data);
      } catch (error) {
        console.error("err", error);
        return error;
      }
    }
    if (record.eventName === "MODIFY") {
      try {
      } catch (err) {
        console.error("err", err);
        return err;
      }
    }
  }
};
