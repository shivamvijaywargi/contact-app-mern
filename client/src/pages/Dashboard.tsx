import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

import axiosClient, { fetchAllContacts } from "../http";
import useAuthStore from "../stores/authStore";

export interface IContact {
  _id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  updatedAt: string;
  createdAt: string;
}

export interface IContacts {
  contacts: IContact[];
  message: string;
  success: boolean;
}

const Dashboard = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState<IContact[] | never[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/login");
    }

    (async () => {
      try {
        const { data } = await fetchAllContacts();

        if (data.success) {
          setContacts(data.contacts);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error);
          toast.error(error?.response?.data?.message);
        }
      }
    })();
  }, []);

  return (
    <div className="overflow-x-auto mb-8">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody className="px-6">
          {contacts &&
            contacts.map((contact, idx) => (
              <tr key={contact._id}>
                <th>{idx + 1}</th>
                <td>{contact.name}</td>
                <td>{contact.email ? contact.email : ""}</td>
                <td>{contact.phoneNumber}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
