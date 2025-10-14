package arrayprograms;

public class ArrayExample2 {
    public static void main(String[] args) {
        int[] numbers = {45, 22, 89, 67, 12};

        int largest = numbers[0];

        for (int i = 1; i < numbers.length; i++) {
            if (numbers[i] > largest) {
                largest = numbers[i];
            }
        }

        System.out.println("Array elements:");
        for (int num : numbers) {
            System.out.print(num + " ");
        }

        System.out.println("\nLargest element in the array: " + largest);
    }
}
