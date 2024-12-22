import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import * as AdminServer from "../../server/adminStore";

const UserGrowthChart = () => {
	const [userGrowthData, setUserGrowthData] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const accessToken = JSON.parse(localStorage.getItem("access_token_admin"));
				if (accessToken) {
					const response = await AdminServer.getInfomationUserv2(accessToken);
					if (response?.listData) {
						setUserGrowthData(response.listData);
					}
				}
			} catch (error) {
				console.error("Failed to fetch user growth data:", error);
			}
		};
		fetchUsers();
	}, []);

	return (
		<div className="bg-gray-800 p-6 rounded-xl shadow-lg">
			<h2 className="text-xl text-white mb-4">User Growth</h2>
			<div style={{ height: 320 }}>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={userGrowthData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" />
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default UserGrowthChart;
