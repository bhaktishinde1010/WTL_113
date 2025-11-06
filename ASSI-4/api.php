<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "student_database";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle preflight request
if ($method == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Process the request
switch ($method) {
    case 'GET':
        // Get all students or a specific student
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = "SELECT * FROM students WHERE id = $id";
        } else {
            $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
            $sql = "SELECT * FROM students";
            
            if (!empty($search)) {
                $sql .= " WHERE name LIKE '%$search%' OR student_id LIKE '%$search%' OR roll_no LIKE '%$search%'";
            }
            
            $sql .= " ORDER BY id DESC";
        }
        
        $result = $conn->query($sql);
        $students = array();
        
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $students[] = $row;
            }
        }
        
        echo json_encode($students);
        break;
        
    case 'POST':
        // Create a new student
        $data = json_decode(file_get_contents("php://input"), true);
        
        $student_id = $conn->real_escape_string($data['student_id']);
        $roll_no = $conn->real_escape_string($data['roll_no']);
        $name = $conn->real_escape_string($data['name']);
        $contact_mobile = isset($data['contact_mobile']) ? $conn->real_escape_string($data['contact_mobile']) : '';
        $contact_email = isset($data['contact_email']) ? $conn->real_escape_string($data['contact_email']) : '';
        $class_name = isset($data['class_name']) ? $conn->real_escape_string($data['class_name']) : '';
        $department = isset($data['department']) ? $conn->real_escape_string($data['department']) : '';
        $division = isset($data['division']) ? $conn->real_escape_string($data['division']) : '';
        $other_info = isset($data['other_info']) ? $conn->real_escape_string($data['other_info']) : '';
        
        $sql = "INSERT INTO students (student_id, roll_no, name, contact_mobile, contact_email, class_name, department, division, other_info)
                VALUES ('$student_id', '$roll_no', '$name', '$contact_mobile', '$contact_email', '$class_name', '$department', '$division', '$other_info')";
        
        if ($conn->query($sql) === TRUE) {
            $last_id = $conn->insert_id;
            echo json_encode(array("id" => $last_id, "message" => "Student created successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Error: " . $sql . "<br>" . $conn->error));
        }
        break;
        
    case 'PUT':
        // Update a student
        $data = json_decode(file_get_contents("php://input"), true);
        $id = intval($data['id']);
        
        $student_id = $conn->real_escape_string($data['student_id']);
        $roll_no = $conn->real_escape_string($data['roll_no']);
        $name = $conn->real_escape_string($data['name']);
        $contact_mobile = isset($data['contact_mobile']) ? $conn->real_escape_string($data['contact_mobile']) : '';
        $contact_email = isset($data['contact_email']) ? $conn->real_escape_string($data['contact_email']) : '';
        $class_name = isset($data['class_name']) ? $conn->real_escape_string($data['class_name']) : '';
        $department = isset($data['department']) ? $conn->real_escape_string($data['department']) : '';
        $division = isset($data['division']) ? $conn->real_escape_string($data['division']) : '';
        $other_info = isset($data['other_info']) ? $conn->real_escape_string($data['other_info']) : '';
        
        $sql = "UPDATE students SET 
                student_id='$student_id', roll_no='$roll_no', name='$name', 
                contact_mobile='$contact_mobile', contact_email='$contact_email', 
                class_name='$class_name', department='$department', 
                division='$division', other_info='$other_info' 
                WHERE id=$id";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(array("message" => "Student updated successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Error: " . $sql . "<br>" . $conn->error));
        }
        break;
        
    case 'DELETE':
        // Delete a student
        $id = intval($_GET['id']);
        $sql = "DELETE FROM students WHERE id=$id";
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode(array("message" => "Student deleted successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("error" => "Error: " . $sql . "<br>" . $conn->error));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("error" => "Method not allowed"));
        break;
}

$conn->close();
?>