package datatypeprograms;

public class DatatypeExample3 {
    public static void main(String[] args) {
        int number = 100;
        double converted = number;  // Implicit casting (int → double)

        double price = 99.99;
        int roundedPrice = (int) price;  // Explicit casting (double → int)

        System.out.println("Original integer: " + number);
        System.out.println("Implicit casting to double: " + converted);
        System.out.println("Original double: " + price);
        System.out.println("Explicit casting to int: " + roundedPrice);
    }
}
