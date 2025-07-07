import React from 'react';
import ReactDOM from 'react-dom';

export default function Modal({ children, onClose }) {
  // Tìm đến "cổng dịch chuyển" mà chúng ta đã tạo trong index.html
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) return null; // Trả về null nếu không tìm thấy root

  // Sử dụng ReactDOM.createPortal để render children vào modal-root
  return ReactDOM.createPortal(
    // Lớp phủ màu đen
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose} // Cho phép đóng modal khi nhấp ra ngoài
    >
      {/* Nội dung của modal (ví dụ: form) */}
      <div 
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()} // Ngăn việc nhấp vào form cũng đóng modal
      >
        {children}
      </div>
    </div>,
    modalRoot
  );
}