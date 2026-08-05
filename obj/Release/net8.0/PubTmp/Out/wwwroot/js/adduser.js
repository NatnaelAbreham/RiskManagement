document.getElementById("statusToggle")
    .addEventListener("change", function () {

        this.value = this.checked ? "1" : "0";

    });

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("addUserForm");
    const statusToggle = document.getElementById("statusToggle");

    form.addEventListener("submit", async function (e) {

        e.preventDefault();
     

    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }

        const dto = {

            fullName: document.getElementById("FullName").value.trim(),

            email: document.getElementById("Email").value.trim(),

            phone: document.getElementById("Phone").value.trim(),

            role: document.getElementById("Role").value,

            status: statusToggle.checked ? "1" : "0"

        };

        try {

            const response = await fetch("/Admin/adduser", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dto)

            });

            const result = await response.json();

            if (response.ok && result.success) {

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: result.message
                });

                form.reset();

                statusToggle.checked = true;

            }
            else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Duplicate User',
                    text: result.message
                });
                //alert(result.message || "Unable to add user.");

            }

        }
        catch (error) {

            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong.'
            });
            //alert("An unexpected error occurred.");

        }

    });

});
