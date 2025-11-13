module adder_tb(); //TestBench code start
reg [15:0] a;
reg [15:0] b;
wire [16:0] c;

adder DUT(.a(a),.b(b),.c(c)); //DUT Instantiation

initial
begin	
	$dumpfile("dump.vcd");
	$dumpvars;
end
initial
repeat(10) begin
a = ($random)%100; //apply random stimulus
b = ($random)%100;
#10
$display(" a=%0d,b=%0d,c=%0d",a,b,c);
if( a + b != c) // monitor logic.
$display(" *ERROR* ");
end
endmodule //TestBench code end
