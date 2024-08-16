const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();
const ssm = new AWS.SSM();

module.exports.handler = async (event) => {
  const agentId = event.arguments.agentId;
  var options = {
    Name: 'agent-status-tracker-table', /* required */
    WithDecryption: false
  };
  const agent_status_tracker = await ssm.getParameter(options).promise();
  try {
    const params = {
      Key: {
        agentId: {
          S: agentId,
        },
      },
      TableName:  agent_status_tracker.Parameter.Value,
    };

    await dynamodb.deleteItem(params);
    return {
      status: 200,
      message: "itam deleted successfully",
    };
  } catch (errror) {
    return errror;
  }
};
