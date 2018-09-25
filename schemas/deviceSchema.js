'user strict';

let deviceSchema = {
    "$id": "https://tetrascience.com/device.schema.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "A representation of a device",
    "type": "object",
    "required": ["deviceId", "name", "type", "city"],
    "properties": {
        "deviceId": {
            "type": "string",
            "description": "Device ID",
            "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$"
        },
        "name": {
            "type": "string",
            "description": "Device name",
            "faker": "commerce.productName" // faker.js library
        },
        "type": {
            "type": "string",
            "description": "Device type",
            "faker": "company.companyName" // faker.js library
        },
        "city": {
            "type": "string",
            "description": "Location",
            "faker": "address.city" // faker.js library
        }
    }
}

module.exports = deviceSchema;