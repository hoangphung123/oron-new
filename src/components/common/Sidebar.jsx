import {
	Menu,
	Settings,
	ShoppingBag,
	Users,
	Megaphone,
	Lock,
	LogOut,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SIDEBAR_ITEMS = [
	{ name: "Users", icon: Users, color: "#EC4899", href: "/admin/users" },
	{ name: "Report", icon: ShoppingBag, color: "#8B5CF6", href: "/admin" },
	{ name: "Advertisement", icon: Megaphone, color: "#6EE7B7", href: "/admin/advertise" },
	// { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/admin/setting" },
];

const changePassWord = async (accessToken, dataChange) => {
	try {
		const response = await axios.patch(
			`${process.env.REACT_APP_API_URL}/user/change-password`,
			dataChange,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || "An error occurred";
	}
};

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const navigate = useNavigate();

	const handleChangePassword = async () => {
		const token = localStorage.getItem("authToken");
		try {
			if (!oldPassword || !newPassword) {
				setErrorMessage("Please fill in both fields.");
				return;
			}
			await changePassWord(token, { oldPassword, newPassword });
			setSuccessMessage("Password changed successfully!");
			setErrorMessage("");
			setTimeout(() => {
				setIsPopupOpen(false);
			}, 1500);
		} catch (error) {
			setErrorMessage(error);
			setSuccessMessage("");
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		navigate("/loginAdmin");
	};

	return (
		<>
			<motion.div
				className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"
					}`}
				animate={{ width: isSidebarOpen ? 256 : 80 }}
			>
				<div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
					{/* Toggle Button */}
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
					>
						<Menu size={24} />
					</motion.button>

					{/* Sidebar Items */}
					<nav className='mt-8 flex-grow'>
						{SIDEBAR_ITEMS.map((item) => (
							<Link key={item.href} to={item.href}>
								<motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
									<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
									<AnimatePresence>
										{isSidebarOpen && (
											<motion.span
												className='ml-4 whitespace-nowrap'
												initial={{ opacity: 0, width: 0 }}
												animate={{ opacity: 1, width: "auto" }}
												exit={{ opacity: 0, width: 0 }}
												transition={{ duration: 0.2, delay: 0.3 }}
											>
												{item.name}
											</motion.span>
										)}
									</AnimatePresence>
								</motion.div>
							</Link>
						))}
					</nav>

					{/* Change Password and Logout Buttons */}
					<div className='mt-auto'>
						<div onClick={() => setIsPopupOpen(true)}>
							<motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 cursor-pointer'>
								<Lock size={20} style={{ color: "#F59E0B", minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											Change Password
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</div>

						<div onClick={handleLogout}>
							<motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer'>
								<LogOut size={20} style={{ color: "#EF4444", minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap text-red-500'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											Logout
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Popup */}
			<AnimatePresence>
				{isPopupOpen && (
					<motion.div
						className='fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className='bg-white rounded-lg p-6 shadow-lg w-80'
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
						>
							<h2 className='text-lg font-semibold mb-4'>Change Password</h2>
							{errorMessage && <p className='text-red-500 text-sm mb-4'>{errorMessage}</p>}
							{successMessage && <p className='text-green-500 text-sm mb-4'>{successMessage}</p>}
							<div className='mb-4'>
								<label className='block text-sm font-medium text-gray-700'>Old Password</label>
								<input
									type='password'
									value={oldPassword}
									onChange={(e) => setOldPassword(e.target.value)}
									className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black' // Thêm text-black
								/>
							</div>
							<div className='mb-4'>
								<label className='block text-sm font-medium text-gray-700'>New Password</label>
								<input
									type='password'
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black' // Thêm text-black
								/>
							</div>

							<div className='flex justify-end'>
								<button
									className='bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded mr-2'
									onClick={() => setIsPopupOpen(false)}
								>
									Cancel
								</button>
								<button
									className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded'
									onClick={handleChangePassword}
								>
									Save
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default Sidebar;
