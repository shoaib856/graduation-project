import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

/**
 * @param {string} type
 * @param {string} msg
 */

export function toastMsg(type, msg) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
  });
  Toast.fire({
    icon: type,
    customClass: {
      container: "z-50",
    },
    title: `<h1 class=${
      type === "error"
        ? "text-red-400"
        : type === "success"
        ? "text-emerald-400"
        : "text-sky-400"
    }>${msg}</h1>`,
  });
}
