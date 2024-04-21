// utils/alert.js or wherever you prefer to keep utility functions

import Swal from "sweetalert2";

const fireAlert = (options: {
  title?: string;
  text?: string;
  icon?: "success" | "error" | "warning" | "info" | "question";
}) => {
  Swal.fire({
    position: "top-end",
    timer: 2000,
    showConfirmButton: false,
    title: options.title || "Default Title",
    text: options.text || "Default Text",
    icon: options.icon || "info",
  });
};

export default fireAlert;
