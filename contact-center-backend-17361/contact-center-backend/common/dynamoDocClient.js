const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

async function getById(TableName, Key) {
  console.log(Key, { Key });
  try {
    let get = await dynamodb
      .getItem({
        TableName,
        Key,
      })
      .promise();
    console.log("get", get);
    return get;
  } catch (error) {
    console.log("error", error);
    return error;
  }
}

async function createItem(params) {
  try {
    const data = await docClient.putItem(params).promise();
    console.log("data", data);
    return data;
  } catch (err) {
    return err;
  }
}
module.exports.getById = getById;
module.exports.createItem = createItem;
