import "sweetalert2/src/sweetalert2.scss";
import Swal from "sweetalert2";

export const showResult = (setResult, result, setResultImg, resultImg, img) => {
  Swal.fire({
    title: `<h1 class="text-4xl text-emerald-900 font-sans font-bold">The Model's Result</h1>`,
    imageUrl: URL.createObjectURL(resultImg || img),
    confirmButtonText: "Done",
    customClass: {
      image: "mt-2 mb-0",
      title: "pt-2",
      htmlContainer: "p-0 m-3",
      confirmButton:
        "!text-lg !border-none !bg-emerald-800 hover:!bg-emerald-500 focus:!shadow-none",
    },
    html: `
         <div class= "text-2xl text-emerald-400 font-extrabold text-left font-mono ">
         <div><span>Plant Name: </span> <span class="text-emerald-600">${
           result.plant ?? ""
         }</span> </div>
         <hr class="my-3 h-1 block bg-emerald-600 opacity-90">
         <div>
          <p>Diseases: </p>
          <ul class="text-emerald-600">
          ${
            Array.isArray(result.diseas)
              ? [...result.diseas]
                  .map((ele, i) => {
                    return `<li>${i + 1}) ${ele}</li>`;
                  })
                  .join("") ?? ""
              : `<li>1) ${result.diseas}</li>` ?? ""
          }
          </ul>
         </div>
         <hr class="my-3 h-1 block bg-emerald-600 opacity-90">
         <div><span>Confd:</span> <span class="text-emerald-600">${
           result.confd !== null ? result.confd + "%" : ""
         } </span></div>
         </div>
        `,
    showLoaderOnConfirm: true,
    preConfirm: () => {
      setResult(null);
      setResultImg(null);
    },
  });
};
