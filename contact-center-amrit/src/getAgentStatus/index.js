const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();
const ssm = new AWS.SSM();
module.exports.handler = async (event) => {
  let options = {
    Name: "agent-status-tracker-table" /* required */,
    WithDecryption: false,
  };
  const agent_status_tracker = await ssm.getParameter(options).promise();
  try {
    const params = {
      TableName: agent_status_tracker.Parameter.Value,
    };

    return dynamodb
      .scan(params)
      .promise()
      .then((data) => {
        const agentStatus = [];
        for (let i = 0; i < data.Items.length; i++) {
          agentStatus.push({
            agentId: data.Items[i].agentId.S,
            startTimeStamp: data.Items[i].startTimeStamp.S,
            endTimeStamp: data.Items[i].endTimeStamp.S,
            status: data.Items[i].status.S,
          });
        }
        return agentStatus;
      });
  } catch (err) {
    return err;
  }
};

