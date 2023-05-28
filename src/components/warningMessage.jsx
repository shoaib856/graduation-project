import Swal from "sweetalert2";

const warningMessage = (process, param = null) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      actions: "btn-group",
      confirmButton: "btn btn-success bg-green-700 !rounded-l-md",
      cancelButton: "btn btn-danger bg-red-600",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, do it!",
      cancelButtonText: "No, cancel!",
    })
    .then((result) => {
      if (result.isConfirmed) {
        param ? process(param) : process();
      }
    });
};

export default warningMessage;
