package operatorprograms;

public class OperatorExample2 {
    public static void main(String[] args) {
        int x = 10, y = 20;
        
        //Relational and Logical Operators
        
        System.out.println("x == y : " + (x == y));
        System.out.println("x != y : " + (x != y));
        System.out.println("x > y  : " + (x > y));
        System.out.println("x < y  : " + (x < y));

        boolean condition1 = (x < y);
        boolean condition2 = (x > 5);

        System.out.println("condition1 && condition2 : " + (condition1 && condition2)); 
        System.out.println("condition1 || condition2 : " + (condition1 || condition2)); 
        System.out.println("!(condition1) : " + !(condition1)); 
    }
}
