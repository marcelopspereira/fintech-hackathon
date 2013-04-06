var validator = require('json-schema');

var loadedSchemas = {};

exports.validateAgainstSchema = function (req, res, schema) {
	if(loadedSchemas[schema] === undefined)
	{
		loadedSchemas[schema] = require(process.cwd()+'/schemas/api/'+schema+'.json');
	}

	var result = validator.validate(req.body, loadedSchemas[schema]);
	if(result.valid === true)
	{
		return true;
	}
	else
	{
		res.send(400,{
			'code': 'InvalidContentError',
			'body': result.errors
		});
		return false;
	}
};
