// import React, { useEffect } from 'react';
// import './Notification.css'; // Tạo file CSS để định dạng

// const Notification = ({ message, type, clearNotification }) => {
//   // Tự động xóa thông báo sau 2 giây
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => {
//         clearNotification(); // Hàm dùng để xóa thông báo
//       }, 2000); // 2 giây

//       return () => clearTimeout(timer); // Xóa bộ đếm nếu component unmount
//     }
//   }, [message, clearNotification]);

//   if (!message) return null;

//   return (
//     <div className={`notification ${type}`}>
//       {message}
//     </div>
//   );
// };

// export default Notification;

import React, { useEffect } from 'react';
import './Notification.css'; // Ensure this file contains the styles from the provided CSS
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome
import 'animate.css'; // Animate.css
import 'font-awesome-animation'; // Optional: Font Awesome Animation

const Notification = ({ message, type, clearNotification }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, clearNotification]);

  if (!message) return null;

  const iconType = {
    success: 'far fa-check-circle faa-tada animated',
    info: 'fa fa-info-circle faa-shake animated',
    warning: 'fa fa-exclamation-triangle faa-flash animated',
    danger: 'far fa-times-circle faa-pulse animated',
    primary: 'fa fa-thumbs-up faa-bounce animated',
  };

  const closeIconType = {
    success: 'fa fa-times greencross',
    info: 'fa fa-times blue-cross',
    warning: 'fa fa-times warning',
    danger: 'fa fa-times danger',
    primary: 'fa fa-times alertprimary',
  };

  return (
    <div className={`alert fade alert-simple alert-${type} alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show`}>
      <i className={`start-icon ${iconType[type]}`}></i>
      <strong className="font__weight-semibold">{type === 'success' ? 'Well done!' : type.charAt(0).toUpperCase() + type.slice(1)}!</strong> {message}
      <button type="button" className="close font__size-18" onClick={clearNotification}>
        <span aria-hidden="true">
          <i className={closeIconType[type]}></i>
        </span>
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
};

export default Notification;

