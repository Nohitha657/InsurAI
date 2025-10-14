package operatorprograms;

public class OperatorExample3 {
    public static void main(String[] args) {
        int num = 5;
        System.out.println("Initial value: " + num);
        
        // Assignment Operators
        int a = 10;
        a += 5; 
        System.out.println("After += : " + a);
        a *= 2; 
        System.out.println("After *= : " + a);
        a -= 4; 
        System.out.println("After -= : " + a);

        // Unary Operators
        System.out.println("Post-increment (num++): " + (num++)); 
        System.out.println("After post-increment: " + num);
        System.out.println("Pre-increment (++num): " + (++num));   
        System.out.println("Pre-decrement (--num): " + (--num));   

        
    }
}

