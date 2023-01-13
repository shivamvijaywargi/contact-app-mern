import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

import axiosClient, { fetchUserContacts } from "../http";
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const fetchContacts = async () => {
    try {
      const { data } = await fetchUserContacts();

      if (data.success) {
        setContacts(data.contacts);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const handleSubmit = async (id: string, e: FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phoneNumber) {
      toast.error("Name, Email, and Phone Number are required");
    }

    try {
      const { data } = await axiosClient.put(`/contacts/${id}`, {
        name,
        email,
        phoneNumber,
      });

      if (data.success) {
        fetchContacts();
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { data } = await axiosClient.delete(`/contacts/${id}`);

      if (data.success) {
        toast.success(data.message);
        fetchContacts();
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        toast.error("Something went wrong, please try again");
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/login");
    }

    fetchContacts();
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
            <th>Update/Delete</th>
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
                <td className="space-x-2">
                  {/* The button to open modal */}
                  <label htmlFor="my-modal-4" className="btn">
                    Edit
                  </label>

                  {/* Put this part before </body> tag */}
                  <input
                    type="checkbox"
                    id="my-modal-4"
                    className="modal-toggle"
                  />
                  <label htmlFor="my-modal-4" className="modal cursor-pointer">
                    <label className="modal-box relative" htmlFor="">
                      <h3 className="text-lg font-bold">
                        Edit Contact Details
                      </h3>
                      <div className="py-4">
                        <form
                          className="space-y-4"
                          onSubmit={(e) => handleSubmit(contact._id, e)}
                        >
                          <div className="form-control">
                            <label className="input-group input-group-vertical">
                              <span>Name</span>
                              <input
                                type="text"
                                placeholder="John Doe"
                                className="input input-bordered"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="input-group input-group-vertical">
                              <span>Email</span>
                              <input
                                type="email"
                                placeholder="info@site.com"
                                className="input input-bordered"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </label>
                          </div>
                          <div className="form-control">
                            <label className="input-group input-group-vertical">
                              <span>Phone Number</span>
                              <input
                                type="number"
                                placeholder="1234567890"
                                className="input input-bordered"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                              />
                            </label>
                          </div>
                          <div className="grid place-items-center mt-6">
                            <input
                              type="submit"
                              value="Update"
                              className="btn btn-info btn-wide"
                            />
                          </div>
                        </form>
                      </div>
                    </label>
                  </label>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="btn btn-error hover:bg-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
