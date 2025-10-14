package classandobjectprograms;

import java.util.Scanner;

public class ClassandObjectExample1 {

    // Class variables
    int id;
    String name;

    void display() {
        System.out.println("Student ID: " + id);
        System.out.println("Student Name: " + name);
    }
    public static void main(String[] args) {
    	Scanner scanner=new Scanner(System.in);
    	
        // Creating an object
        ClassandObjectExample1 student = new ClassandObjectExample1();
        System.out.println("Enter the id: ");
        student.id = scanner.nextInt();
        scanner.nextLine();
        System.out.println("Enter your name: ");
        student.name =scanner.nextLine();

        student.display();
        scanner.close();
    }
}

