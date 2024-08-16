import axios from "axios";
import { useEffect, useState } from "react";
const baseURL = "https://etlhive-backend.onrender.com";

// Login API function
const loginApi = async (username, password) => {
  try {
    const response = await axios.post(`${baseURL}/user/login`, {
      username,
      password,
    });

    const token = response.data.token;
    return token;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    console.log(errorMessage);
    return null;
  }
};

// Fetch Leads function with token in header
const fetchLeads = async (token) => {
  try {
    const response = await axios.get(`${baseURL}/lead`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const leads = response.data.data;
    return leads;
  } catch (error) {
    console.log("Fetch leads failed:", error.message);
    return [];
  }
};

const LeadsComponent = () => {
  const [token, setToken] = useState(null);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate login
    loginApi("satan7549", "Satan@8982")
      .then((token) => {
        if (token) {
          setToken(token);
        } else {
          setError("Login failed");
        }
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  useEffect(() => {
    if (token) {
      // Fetch leads every 1 minute (60000ms)
      const intervalId = setInterval(() => {
        fetchLeads(token)
          .then((fetchedLeads) => {
            setLeads(fetchedLeads);
          })
          .catch((error) => {
            setError(error);
          });
      }, 5 * 60000);

      // Initial fetch when token is set
      fetchLeads(token)
        .then((fetchedLeads) => {
          setLeads(fetchedLeads);
        })
        .catch((error) => {
          setError(error);
        });

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [token]);

  return (
    <div>
      <h1>Leads</h1>
      {error && <p>Error: {error}</p>}
      {leads.length > 0 ? (
        <ul>
          {leads.map((lead, i) => (
            <li key={i}>
              <strong>Name:</strong> {lead.name} <br />
              <strong>Email:</strong> {lead.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No leads found.</p>
      )}
    </div>
  );
};

export default LeadsComponent;
