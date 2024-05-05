import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const supabaseUrl = "https://ksebigkerxwbktkugqdl.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZWJpZ2tlcnh3Ymt0a3VncWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMTI3MTksImV4cCI6MjAyOTc4ODcxOX0.nfxSiHwATmFPHt0wqKrim2dLfcSxYh_jRu6Wcf8gefE";
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch user requests
async function fetchUserRequests() {
    const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .order('udid');

    if (error) {
        console.error('Error fetching user requests:', error.message);
        return;
    }

    // Display user requests
    const userRequestsContainer = document.getElementById('userRequests');
    userRequestsContainer.innerHTML = ''; // Clear previous content
    data.forEach(user => {
        const userContainer = document.createElement('div');
        userContainer.classList.add('user-container', 'border', 'p-3', 'mb-3');

        const name = document.createElement('p');
        name.textContent = `Name: ${user.name}`;

        const udid = document.createElement('p');
        udid.textContent = `UDID: ${user.udid}`;

        const email = document.createElement('p');
        email.textContent = `Email: ${user.email_id}`;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('d-flex', 'justify-content-end', 'mt-2');

        let actionButton;
        if (user.status === true) {
            actionButton = createButton('Accepted', 'btn-success');
            actionButton.addEventListener('click', () => handleAccepted(user));
        } else if (user.status === false) {
            actionButton = createButton('Rejected', 'btn-danger');
        } else {
            const acceptButton = createButton('Accept', 'btn-success');
            const rejectButton = createButton('Reject', 'btn-danger');
            acceptButton.addEventListener('click', () => handleAccept(user));
            rejectButton.addEventListener('click', () => handleReject(user));
            buttonsContainer.append(acceptButton, rejectButton);
        }

        if (actionButton) {
            buttonsContainer.appendChild(actionButton);
        }

        userContainer.append(name, udid, email, buttonsContainer);
        userRequestsContainer.appendChild(userContainer);
    });
}

// Function to create a button element
function createButton(label, className) {
    const button = document.createElement('button');
    button.textContent = label;
    button.classList.add('btn', className, 'mr-2');
    return button;
}

// Function to handle Accept button click
async function handleAccept(user) {
    const { data, error } = await supabase
        .from('user_data')
        .update({ status: true })
        .eq('udid', user.udid);

    if (error) {
        console.error('Error accepting request:', error.message);
    } else {
        console.log('Request accepted successfully.');
        fetchUserRequests(); // Refresh the user requests after accepting
    }
}

// Function to handle Accepted button click
async function handleAccepted(user) {
    console.log('User is already accepted.');
}

// Function to handle Reject button click
async function handleReject(user) {
    const { data, error } = await supabase
        .from('user_data')
        .update({ status: false })
        .eq('udid', user.udid);

    if (error) {
        console.error('Error rejecting request:', error.message);
    } else {
        console.log('Request rejected successfully.');
        fetchUserRequests(); // Refresh the user requests after rejecting
    }
}

// Fetch user requests when the page loads
document.addEventListener('DOMContentLoaded', fetchUserRequests);
