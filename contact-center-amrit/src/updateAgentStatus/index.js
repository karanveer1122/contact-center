const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();
const ssm = new AWS.SSM();

module.exports.handler = async (event) => {
  const agentId = event.arguments.agentId;
  const endTimeStamp = event.arguments.endTimeStamp;
  const startTimeStamp = event.arguments.startTimeStamp;
  let options = {
    Name: "agent-status-tracker-table" /* required */,
    WithDecryption: false,
  };
  const agent_status_tracker = await ssm.getParameter(options).promise();
  try {
    const params = {
      ExpressionAttributeNames: {
        "#e": "endTimeStamp",
        "#t": "startTimeStamp",
      },
      ExpressionAttributeValues: {
        ":e": {
          S: endTimeStamp,
        },
        ":t": {
          S: startTimeStamp,
        },
      },
      Key: {
        agentId: {
          S: agentId,
        },
      },
      ReturnValues: "ALL_NEW",
      TableName: agent_status_tracker.Parameter.Value,
      UpdateExpression: "SET #e = :e, #t = :t",
    };

    return dynamodb
      .updateItem(params)
      .promise()
      .then((data) => {
        const body = data.Attributes;
        console.log("body", body);
        return {
          agentId: body.agentId.S,
          status: body.status.S,
          startTimeStamp: body.startTimeStamp.S,
          endTimeStamp: body.endTimeStamp.S,
        };
      });
  } catch (err) {
    return err;
  }
};

