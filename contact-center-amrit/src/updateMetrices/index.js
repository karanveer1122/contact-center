const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();
const ssm = new AWS.SSM();
module.exports.handler = async (event) => {
  let options = {
    Name: "agent-dashboard-metrices-table" /* required */,
    WithDecryption: false,
  };
  const agent_dashboard_table = await ssm.getParameter(options).promise();
  for (let index = 0; index < event.Records.length; index++) {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let fullDate = `${day}.${month}.${year}.`;

    let available = "0";
    let pcw = "0";
    let busy = "0";
    let idle = "0";
    let record = event.Records[index];

    const agentId = record.dynamodb.NewImage.agentId.S;
    if (record.eventName === "INSERT") {
      try {
        const params = {
          Item: {
            agentId: {
              S: agentId,
            },
            date: {
              S: fullDate,
            },
            available: {
              N: available,
            },
            pcw: {
              N: pcw,
            },
            busy: {
              N: busy,
            },
            idle: {
              N: idle,
            },
          },
          ReturnConsumedCapacity: "TOTAL",
          TableName: agent_dashboard_table.Parameter.Value,
        };
        const data = await dynamodb.putItem(params).promise();
        return {
          agentId,
        };
      } catch (error) {
        console.error("err", error);
        return error;
      }
    }
    if (record.eventName === "MODIFY") {
      const startTimeStamp = record.dynamodb.NewImage.startTimeStamp.S;
      const endTimeStamp = record.dynamodb.NewImage.endTimeStamp.S;
      const status = record.dynamodb.NewImage.status.S;
      const d = endTimeStamp - startTimeStamp;
      const duration = d.toString();
      if (status === "available") {
        available = duration;
      }
      if (status === "pcw") {
        pcw = duration;
      }
      if (status === "busy") {
        busy = duration;
      }
      if (status === "idle") {
        idle = duration;
      }

      try {
        const params = {
          ExpressionAttributeNames: {
            "#a": "available",
            "#b": "busy",
            "#p": "pcw",
            "#i": "idle",
            "#d": "date",
          },
          ExpressionAttributeValues: {
            ":a": {
              N: available,
            },
            ":b": {
              N: busy,
            },
            ":p": {
              N: pcw,
            },
            ":i": {
              N: idle,
            },
            ":d": {
              S: fullDate,
            },
          },
          Key: {
            agentId: {
              S: agentId,
            },
          },
          ReturnValues: "ALL_NEW",
          TableName: agent_dashboard_table.Parameter.Value,
          UpdateExpression: "ADD #a :a, #b :b, #p :p, #i :i SET #d = :d",
        };
        const data = await dynamodb.updateItem(params).promise();
        return {
          agentId,
        };
      } catch (err) {
        console.error("err", err);
        return err;
      }
    }
  }
};
