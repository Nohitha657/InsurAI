package classandobjectprograms;

import java.util.Scanner;

public class ClassandObjectExample2 {

    // Attributes
    String employeeName;
    double salary;

   
    void showDetails() {
        System.out.println("Employee Name: " + employeeName);
        System.out.println("Salary: " + salary);
        System.out.println("-------------------");
    }

    public static void main(String[] args) {
    	Scanner sc=new Scanner(System.in);
        // Creating multiple objects
        ClassandObjectExample2 emp1 = new ClassandObjectExample2();
        ClassandObjectExample2 emp2 = new ClassandObjectExample2();

        // Assigning values
        System.out.println("Enter the emp1 name: ");
        emp1.employeeName =sc.nextLine();
        System.out.println("Enter the salary: ");
        emp1.salary = sc.nextDouble();
        sc.nextLine();
        System.out.println("Enter the emp2 name: ");
        emp2.employeeName = sc.nextLine();
        System.out.println("Enter the salary: ");
        emp2.salary = sc.nextDouble();

        // Displaying data
        emp1.showDetails();
        emp2.showDetails();
        sc.close();
    }
}
