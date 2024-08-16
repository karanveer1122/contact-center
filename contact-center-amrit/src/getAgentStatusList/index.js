/* npm modules */
const AWS = require('aws-sdk');

const errorHandler = require('../shared/errorHandler');
let correlationId;

module.exports.handler = async (event, context) => {
    //console.info("Event: ", JSON.stringify(event));
    try {
        var connect = new AWS.Connect();
        var params = {
          InstanceId: process.env.INSTANCE_ID
        };
        const data = await connect.listAgentStatuses(params).promise();
        const Statuses = data.AgentStatusSummaryList.map(agentStatusProps("Name", "Type"));

        const response = {
            body: {
                Statuses: Statuses
            }
        };
        //console.info("Response: ", JSON.stringify(response));
        return response;

    } catch (e) {
        //console.error("Error: ", e);
        throw errorHandler.handleError(1003, correlationId, e.message);
    }

};

function agentStatusProps(...props){
  return function(item){
    const agentStatus = {};
    props.forEach(keyName =>{
      agentStatus[keyName] = item[keyName];
    });
    
    return agentStatus;
  }
}
