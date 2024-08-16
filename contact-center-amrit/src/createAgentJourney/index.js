const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ convertEmptyValues: true });
const ssm = new AWS.SSM();
const { uuid } = require("uuidv4");

module.exports.handler = async (event) => {
  const journeyId = uuid();
  let activity = "";
  console.log("outside", activity);
  let activityOf = "";
  let contactStatus = "";
  let agentId = "";
  let agentName = "";
  let queueId = "";
  let redmineNumber = "";
  let recordingLink = "";
  if (event.arguments.activity) {
    activity = event.arguments.activity;
    console.log("if activity", activity);
  }
  console.log("activity", activity);
  const contactId = event.arguments.contactId;
  const customerId = event.arguments.customerId;
  const customerName = event.arguments.customerName;
  const channel = event.arguments.channel;
  const type = event.arguments.type;
  activityOf = event.arguments.activityOf;
  activity = event.arguments.activity;
  if (activityOf) {
    if (!activity) {
      return {
        message: "activity of cannot be empty",
      };
    }
  }
  contactStatus = event.arguments.contactStatus;
  // if(!activityOf && !contactStatus)
  const timeStamp = event.arguments.timeStamp;
  agentId = event.arguments.agentId;
  agentName = event.arguments.agentName;
  queueId = event.arguments.queueId;
  redmineNumber = event.arguments.redmineNumber;
  recordingLink = event.arguments.recordingLink;
  let options = {
    Name: "contact-activity-table" /* required */,
    WithDecryption: false,
  };
  const contact_activity_table = await ssm.getParameter(options).promise();

  try {
    const params = {
      Item: {
        journeyId: {
          S: journeyId,
        },
        contactId: {
          S: contactId,
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
        activity: {
          S: activity,
        },
        activityOf: {
          S: activityOf,
        },
        contactStatus: {
          S: contactStatus,
        },
        timeStamp: {
          S: timeStamp,
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
      TableName: contact_activity_table.Parameter.Value,
    };
    const data = await dynamodb.putItem(params).promise();
    console.info("data", data);
    return {
      journeyId,
    };
  } catch (error) {
    console.error(error, "error");
  }
};
