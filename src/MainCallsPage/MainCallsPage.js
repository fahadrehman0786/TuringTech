import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import axios from 'axios';

const MainCallsPage = () => {
  const [data, setData] = useState(null);
  const [token, setToken] = useState()


  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginResponse = await axios.post(
          'https://frontend-test-api.aircall.io/auth/login',
          { username: 'fahad', password: 'test123' }
        );

        setToken(loginResponse.data.access_token);


        const meResponse = await axios.get('https://frontend-test-api.aircall.io/calls', {
            headers: {
              Authorization: `Bearer ${loginResponse.data.access_token}`,
            },
          });

          const responseData = meResponse.data;
          setData(responseData.nodes);
          console.log(responseData.nodes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleCallItemClick =async(call) => {
    console.log("This is tok "+token)

    console.log('Clicked call:', call);
    const meResponse = await axios.get(`https://frontend-test-api.aircall.io/calls/${call.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

console.log(meResponse)

  };

  if (!data) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(data)) {
    console.log('Unexpected data structure:', data);
    return <div>Error: Invalid data structure</div>;
  }

  return (
    <div>
{data.map((call) => (
    <Link to={`/calldetailpage/${call.id}/${token}`} key={call.id}>

    <div>
      {call.from} - {call.to} - this is id {call.id}
    </div>
  </Link>

))}

    </div>
  );
};

export default MainCallsPage;
