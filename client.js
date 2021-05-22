const axios = require('axios');

const SERVER_URL = 'http://localhost:5000';

const array = [1, 2, 3, 1];

function compare({ left, right, request_id }) {
  return axios.post(SERVER_URL, {
    request_id: request_id,
    type: 'comp_result',	
    answer: array[left] < array[right],
  });
}

async function getValue(type) {
	try {
		let { data, status } = await axios.post(SERVER_URL, {
			type,
			length: array.length,
		});

		if (status < 300) {
			while (data.type !== 'done') {
				const response = await compare(data);
				if (response.status > 300) throw new Error(response.message);

				data = response.data;
			}

			console.log({ type: data.type })
		}

  	return array[data.result];

	} catch(e) {
		console.log(e.message)
	}
}

getValue('compute_max')
  .then(result => console.log(result)); // 3

// getValue('compute_min')
//   .then(result => console.log(result)); // 1