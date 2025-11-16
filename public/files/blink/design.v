module blink (
    input wire clk,
    input wire rst,
    output reg [3:0] led
);
    always @(posedge clk or posedge rst) begin
        if (rst) begin
            led <= 4'b0001;
        end else begin
            led <= {led[2:0], led[3]};
        end
    end
endmodule