const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();
const ssm = new AWS.SSM();


module.exports.handler = async (event) => {
  const agentId = event.arguments.agentId;
  const startTimeStamp = event.arguments.startTimeStamp;
  const status = event.arguments.status;

  let options = {
    Name: "agent-status-tracker-table" /* required */,
    WithDecryption: false,

  };
  const agent_status_tracker = await ssm.getParameter(options).promise();

  try {
    const params = {
      Item: {
        agentId: {
          S: agentId,
        },
        startTimeStamp: {
          S: startTimeStamp,
        },
        status: {
          S: status,
        },
      },
      ReturnConsumedCapacity: "TOTAL",

      TableName: agent_status_tracker.Parameter.Value,
    };
    const data = await dynamodb.putItem(params).promise();
    console.info("data", data);

    return {
      agentId,
      status,
      startTimeStamp,
    };
  } catch (error) {
    console.error(error, "error");

  }
};
