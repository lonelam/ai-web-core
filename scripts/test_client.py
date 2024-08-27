import requests
import time
import json

# Set the login endpoint and task endpoints
login_url = 'https://aiweb.laizn.com/api/auth/login'
deque_url = 'https://aiweb.laizn.com/api/task/deque'
resolve_url = 'https://aiweb.laizn.com/api/task/resolve'

# Set the login credentials
login_data = {
    'email': 'a@laizn.com',
    'password': 'WcSNFDi7zqjyb2G.'
}

# Perform login and get access token
response = requests.post(login_url, json=login_data)

template_data = json.dumps({
    "templateName": "test_simple",
    "workerName": "test"
})

if response.status_code == 200:
    token = response.json().get('accessToken')
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    while True:
        try:
            # Deque a task
            deque_response = requests.post(deque_url, headers=headers, data=template_data)

            if deque_response.status_code == 200:
                dequeued_task = deque_response.json()
                task_id = dequeued_task.get('id')

                if task_id:
                    # Create the resolve task parameters
                    result_data = json.dumps({
                        "image": "<test image url>"
                    })

                    resolve_data = {
                        "id": task_id,
                        "resultData": result_data
                    }

                    # Resolve the task
                    resolve_response = requests.post(resolve_url, headers=headers, json=resolve_data)

                    if resolve_response.status_code == 200:
                        print(f"Successfully resolved task with id {task_id}")
                    else:
                        print(f"Failed to resolve task {task_id}. Status code: {resolve_response.status_code}")

            elif deque_response.status_code == 404:
                print("No more tasks in the queue. Waiting for new tasks...")
                time.sleep(5)  # Wait for 5 seconds before dequeuing again

            else:
                print(f"Failed to deque task. Status code: {deque_response.status_code} data: {deque_response.json()}",)
                break

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            break

else:
    print(f"Login failed. Status code: {response.status_code}, data: {response.json()}")

